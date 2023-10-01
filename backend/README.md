# Flask Backend

## Environment Setup
install pipenv and pull packages
```
pip install pipenv
pipenv install
```

## Project Run
Activate virtual environment
```
pipenv shell
flask run
```

To install packages
```
pipenv install [package-name]
```

## Routes

### Predict Cargo
GET /predict_cargo/<num_months>

num_months: integer from 1 to 12

returns JSON:
```
{
    'data': {
        'cargo': cargo_dataset array,
        'month': month_dataset array
    },
    'predicted_index': [start_index, end_index]
}
```

where 
- cargo_dataset is the whole set of total cargo (actual + predicted)
- month_dataset is the whole set of corresponding months for the total cargo data points
- predicted_index is an array of start and end index of the predicted range

### Get Cost Function
GET /cost_function

formula used is: a*log(cost) + b

returns JSON:
```
{
    'message': 'formula is in the format `throughput = a*log(cost) + b`',
    'data': {
        'a': a_constant,
        'b': b_constant
    }
}
```
where 
- message is a simple message signifyig the formula and the meaning
- data object consists of a and b as the constants of the forumla