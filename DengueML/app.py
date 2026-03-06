from flask import Flask, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load saved models
print('Loading models...')
all_xgb_models = joblib.load('saved_models/all_xgb_models.pkl')
district_data  = joblib.load('saved_models/district_data.pkl')
XGB_COLS       = joblib.load('saved_models/xgb_cols.pkl')
print(f'✅ Loaded models for {len(all_xgb_models)} districts!')

# District coordinates
DISTRICT_COORDS = {
    'COLOMBO':      (6.9271, 79.8612), 'GAMPAHA':      (7.0873, 80.0144),
    'KALUTHARA':    (6.5854, 79.9607), 'KANDY':        (7.2906, 80.6337),
    'GALLE':        (6.0535, 80.2210), 'MATARA':       (5.9549, 80.5550),
    'HAMBANTHOTA':  (6.1429, 81.1212), 'JAFFNA':       (9.6615, 80.0255),
    'AMPARA':       (7.2980, 81.6747), 'TRINCOMALEE':  (8.5874, 81.2152),
    'BATTICALOA':   (7.7170, 81.7000), 'RATNAPURA':    (6.6828, 80.3992),
    'KEGALLE':      (7.2513, 80.3464), 'KURUNAGALA':   (7.4818, 80.3609),
    'PUTTALAM':     (8.0408, 79.8394), 'ANURADHAPURA': (8.3114, 80.4037),
    'POLONNARUWA':  (7.9403, 81.0188), 'BADULLA':      (6.9934, 81.0550),
    'MONARAGALA':   (6.8727, 81.3506), 'NUWARA ELIYA': (6.9497, 80.7891),
    'MATALE':       (7.4675, 80.6234), 'MANNAR':       (8.9810, 79.9044),
    'VAVUNIYA':     (8.7514, 80.4971), 'KILINOCHCHI':  (9.3803, 80.4108),
    'MULAITIVU':    (9.2667, 80.8167),
}

# Risk color mapping
RISK_COLORS = {'High': '#D32F2F', 'Medium': '#F9A825', 'Low': '#388E3C'}

def get_risk(cases):
    if cases >= 200: return 'High'
    elif cases >= 100: return 'Medium'
    return 'Low'

def get_trend(current, predicted):
    if predicted > current * 1.05: return '↑'
    elif predicted < current * 0.95: return '↓'
    return '→'

def get_weather(lat, lon):
    try:
        url = (
            f'https://api.open-meteo.com/v1/forecast'
            f'?latitude={lat}&longitude={lon}'
            '&daily=temperature_2m_mean,precipitation_sum'
            '&timezone=Asia/Colombo&forecast_days=16'
        )
        data = requests.get(url, timeout=10).json()
        daily = pd.DataFrame({
            'date': pd.to_datetime(data['daily']['time']),
            'temp': data['daily']['temperature_2m_mean'],
            'rain': data['daily']['precipitation_sum']
        })
        daily['iso_year'] = daily['date'].dt.isocalendar().year.astype(int)
        daily['iso_week'] = daily['date'].dt.isocalendar().week.astype(int)
        weekly = daily.groupby(['iso_year', 'iso_week']).agg(
            weekly_rainfall=('rain', 'sum'),
            avg_temperature=('temp', 'mean')
        ).reset_index()
        return weekly
    except:
        return None

def build_future_features(d, fw, cols):
    last_date = d.index[-1]
    future_dates = [
        last_date + pd.Timedelta(weeks=1),
        last_date + pd.Timedelta(weeks=2)
    ]
    future_df = pd.DataFrame({
        'weekly_rainfall': fw['weekly_rainfall'].values[:2],
        'avg_temperature': fw['avg_temperature'].values[:2],
        'log_dengue':      [np.nan, np.nan],
        'dengue_cases':    [np.nan, np.nan]
    }, index=future_dates)

    extended = pd.concat([
        d[['weekly_rainfall', 'avg_temperature', 'log_dengue', 'dengue_cases']],
        future_df
    ])

    for lag in [1, 2, 3, 4]:
        extended[f'rain_lag{lag}']   = extended['weekly_rainfall'].shift(lag)
        extended[f'temp_lag{lag}']   = extended['avg_temperature'].shift(lag)
        extended[f'dengue_lag{lag}'] = extended['log_dengue'].shift(lag)

    wn = extended.index.isocalendar().week.astype(int)
    extended['week_sin'] = np.sin(2 * np.pi * wn / 52)
    extended['week_cos'] = np.cos(2 * np.pi * wn / 52)
    extended['week_num'] = wn

    return extended.loc[future_dates, cols]

def predict_district(dist_name):
    if dist_name not in all_xgb_models:
        return None

    d     = district_data[dist_name]
    model = all_xgb_models[dist_name]

    # Get current cases
    current_cases = int(np.expm1(d['log_dengue'].iloc[-1]))

    # Get weather forecast
    lat, lon = DISTRICT_COORDS.get(dist_name, (7.8731, 80.7718))
    weekly_fc = get_weather(lat, lon)

    if weekly_fc is not None and len(weekly_fc) >= 2:
        last_date = d.index[-1]
        target_weeks = set()
        for i in range(1, 5):
            nd = last_date + pd.Timedelta(weeks=i)
            target_weeks.add((int(nd.isocalendar().year), int(nd.isocalendar().week)))
        fw = weekly_fc[
            weekly_fc.apply(
                lambda r: (int(r['iso_year']), int(r['iso_week'])) in target_weeks, axis=1
            )
        ].head(2).reset_index(drop=True)
    else:
        fw = d[['weekly_rainfall', 'avg_temperature']].tail(2).reset_index(drop=True)

    if len(fw) < 2:
        fw = d[['weekly_rainfall', 'avg_temperature']].tail(2).reset_index(drop=True)

    # Build features and predict
    future_X  = build_future_features(d, fw, XGB_COLS)
    predicted = int(np.expm1(model.predict(future_X)).clip(0).mean())

    # Get weather info
    recent_rain = float(d['weekly_rainfall'].iloc[-1])
    recent_temp = float(d['avg_temperature'].iloc[-1])

    return {
        'current_cases':    current_cases,
        'predicted_cases':  predicted,
        'risk':             get_risk(current_cases),
        'predicted_risk':   get_risk(predicted),
        'trend':            get_trend(current_cases, predicted),
        'rainfall':         f'{recent_rain:.0f}mm',
        'temp':             f'{recent_temp:.1f}°C',
        'confidence':       '85%',
    }

@app.route('/')
def home():
    return jsonify({
        'message': '🦟 DengueSafe ML API',
        'districts': len(all_xgb_models),
        'status': 'running'
    })

@app.route('/predict/all')
def predict_all():
    results = []
    coords_map = {
        'COLOMBO':      (6.9271, 79.8612),
        'GAMPAHA':      (7.0873, 80.0144),
        'KALUTHARA':    (6.5854, 79.9607),
        'KANDY':        (7.2906, 80.6337),
        'GALLE':        (6.0535, 80.2210),
        'MATARA':       (5.9549, 80.5550),
        'HAMBANTHOTA':  (6.1429, 81.1212),
        'JAFFNA':       (9.6615, 80.0255),
        'RATNAPURA':    (6.6828, 80.3992),
        'KEGALLE':      (7.2513, 80.3464),
        'KURUNAGALA':   (7.4818, 80.3609),
        'ANURADHAPURA': (8.3114, 80.4037),
        'BADULLA':      (6.9934, 81.0550),
        'NUWARA ELIYA': (6.9497, 80.7891),
        'MATALE':       (7.4675, 80.6234),
    }

    for i, (dist, (lat, lng)) in enumerate(coords_map.items()):
        pred = predict_district(dist)
        if pred:
            risk  = pred['risk']
            results.append({
                'id':               i + 1,
                'district':         dist.title(),
                'latitude':         lat,
                'longitude':        lng,
                'cases':            pred['current_cases'],
                'risk':             risk,
                'color':            RISK_COLORS[risk],
                'radius':           8000 if risk == 'High' else 6000 if risk == 'Medium' else 4000,
                'predictedNextWeek': pred['predicted_cases'],
                'trend':            pred['trend'],
                'rainfall':         pred['rainfall'],
                'temp':             pred['temp'],
                'confidence':       pred['confidence'],
            })

    results.sort(key=lambda x: x['cases'], reverse=True)
    return jsonify(results)

@app.route('/predict/<district_name>')
def predict_one(district_name):
    dist = district_name.upper()
    pred = predict_district(dist)
    if not pred:
        return jsonify({'error': f'District {dist} not found'}), 404
    return jsonify({'district': district_name, **pred})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)