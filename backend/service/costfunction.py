import pandas as pd
import numpy as np
from scipy.optimize import curve_fit

class CostFunction:
    def __init__(self, filepath):
        self.filepath = filepath
        self.data = pd.read_csv(filepath, index_col=0)
        print("ML: cost function initialized")

    def reset_data(self):
        self.data = pd.read_csv(self.filepath, index_col=0)

    def get_function(self):
        def logarithmic_function(x, a, b):
            return a * np.log(x) + b
        
        params, covariance = curve_fit(logarithmic_function, self.data['Operational Cost'], self.data['Throughput'])
        a,b = params

        return a,b