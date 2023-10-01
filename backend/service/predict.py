import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA

class STLModel:
    def __init__(self, filepath):
        self.filepath = filepath
        self.df = pd.read_csv(filepath)
        print("ML: STL model initialized")

    def reset_data(self):
        self.df = pd.read_csv(self.filepath)

    def split(self):
        X = self.df['Total Cargo (Thousand Tonnes)']
        y = self.df['Month Rank']
        forecast_range = 12
        split_index = 343-forecast_range+1
        X_train = X.iloc[:split_index]
        y_train = y.iloc[:split_index]

        X_test = X[split_index:]
        y_test = y[split_index:]

        actual_train = self.df.iloc[:split_index]

        return X, y, X_train, y_train, X_test, y_test, actual_train

    def decompose(self, X):
        ts_dicomposition = seasonal_decompose(x=X, model='additive', period=12)
        trend = ts_dicomposition.trend
        self.seasonal = ts_dicomposition.seasonal
        residual = ts_dicomposition.resid

        return trend, residual

    def train_model(self):
        self.reset_data()
        forecast_range = 12
        X, y, X_train, y_train, X_test, y_test, actual_train = self.split()
        trend, residual = self.decompose(X_train)

        trend_model = ARIMA(trend, order=(2, 2, 3))
        self.trend_fit = trend_model.fit()
        trend_pred = pd.Series(self.trend_fit.forecast(forecast_range))

        residual_model = ARIMA(residual, order=(1, 2, 1))
        self.residual_fit = residual_model.fit()
        residual_pred = pd.Series(self.residual_fit.forecast(forecast_range))

        start_month_forecast = actual_train.iloc[-1]['Month Num'] + 1
        n_steps = start_month_forecast+forecast_range-1 # Replace with the desired number of forecasted periods
        period_length = 12
        seasonal_pattern = self.seasonal[:12]
        seasonal_pred = np.tile(seasonal_pattern.values, n_steps // period_length + 1)[start_month_forecast-1:n_steps]

        overall_forecast = trend_pred + seasonal_pred + residual_pred

        n = np.array(X_test).shape[0]
        d = np.abs(np.diff(np.array(X_test))).sum()/(n-1)

        errors = np.abs(X_test - overall_forecast)
        MASE = errors.mean() / d
        print("MASE = ", MASE)

    def predict(self, forecast_range):
        if forecast_range > 12 or forecast_range <= 0:
            return "forecast range out of range. try between 1-12"

        trend_pred = pd.Series(self.trend_fit.forecast(forecast_range)).reset_index(drop=True)
        residual_pred = pd.Series(self.residual_fit.forecast(forecast_range)).reset_index(drop=True)
        start_month_forecast = self.df.iloc[-1]['Month Num'] + 1
        n_steps = start_month_forecast+forecast_range-1
        period_length = 12
        seasonal_pattern = self.seasonal[:12]
        seasonal_pred = np.tile(seasonal_pattern.values, n_steps // period_length + 1)[start_month_forecast-1:n_steps]

        forecast = trend_pred + residual_pred + seasonal_pred
        start_index = self.df.index[-1] + 1
        end_index = start_index+len(forecast)
        forecast.index = range(start_index, end_index)
        
        res = pd.concat([self.df['Total Cargo (Thousand Tonnes)'], forecast]).to_list()
        months = self.df['Month'].to_list()
        # actual+predicted set, start and end of predicted values
        return res, months, start_index, end_index

    def test(self):
        print(self.df)
