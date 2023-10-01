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
        'b': b_constant,
        'latest_cost': latest_cost,
        'slider_range': slider_range
    }
}
```
where message is a simple message signifyig the formula and the meaning
data object consists of a and b as the constants of the forumla
where 
- message is a simple message signifyig the formula and the meaning
- data object consists of a and b as the constants of the forumla
- latest cost is the most recent operational cost for the initial value of the slider
- slider_range is the +- threshold limit for the slider

### Get Data by Column

GET /get_data/<column_name>

- Retrieves data from a specified column in the CSV dataset.

**Parameters:**

- `column_name` (string): The name of the column for which you want to retrieve data.

**Optional Query Parameter:**

- `month` (string, format: "yyyy MMM"): Specifies the month for which data should be retrieved. If not provided, returns the entire column data with corresponding months.

**Returns JSON:**

If `month` is provided:
```
{
    '<column_name>': [<data points for the specified month>]
}
```

If `month` is not provided:
```
{
    '<column_name>': [<all data points for the column>],
    'Months': [<corresponding months for the data points>]
}
```

- `<column_name>`: The name of the requested column.
- `<data points for the specified month>`: Data points for the specified month (if `month` is provided).
- `<all data points for the column>`: All data points for the specified column (if `month` is not provided).
- `<corresponding months for the data points>`: Corresponding months for the data points (if `month` is not provided).

**Example Usage:**

- To retrieve data for the "Total Cargo (Thousand Tonnes)" column for the month "2023 Jan," use the following URL:
  ```
  GET /get_data/Total%20Cargo%20(Thousand%20Tonnes)?month=2023%20Jan
  ```
  Returns data for "Total Cargo (Thousand Tonnes)" for January 2023.

- To retrieve the entire "Total Cargo (Thousand Tonnes)" column without specifying a month, use the following URL:
  ```
  GET /get_data/Total%20Cargo%20(Thousand%20Tonnes)
  ```
  Returns the entire "Total Cargo (Thousand Tonnes)" column with corresponding months.

### Get Latest News

This route retrieves the latest news related to port operations from the Journal of Commerce.

**Endpoint**: `GET /get_latest_news`

**Description**: Retrieves the latest news articles related to port operations.

**Response**:

```json
{
    "message": "Latest news articles related to port operations",
    "data": [
        {
            "headline": "Article Headline 1",
            "sentiment_score": 8
        },
        {
            "headline": "Article Headline 2",
            "sentiment_score": 7
        },
        // ... (more articles)
    ]
}

