import service.predict as p
import service.costfunction as c
import os

csv_directory = os.path.join(os.path.dirname(__file__), '../ml')
csv_file_cargo = os.path.join(csv_directory, 'cargor_model_monthly.csv')
csv_file_cost = os.path.join(csv_directory, 'cost_to_throughput.csv')

stl = p.STLModel(csv_file_cargo)
cf = c.CostFunction(csv_file_cost)

def init_models():
    stl.train_model()
    cf.reset_data()

def retrain_stl():
    stl.train_model()