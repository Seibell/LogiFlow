# Logiflow
Harboring tomorrow's insights.

Logiflow is a cutting-edge solution for optimizing demand and supply in the container logistics ecosystem. It addresses the critical challenge of efficient demand-supply management, ensuring a seamless flow of cargo. 

> NOTE: Backend is deployed on Render free tier. Do take note that initial requests to the backend (aka initial loading of the frontend) might take longer than usual

## Table of Contents
- [About](#about)
  - [Problem Statement](#problem-statement)
  - [Value Proposition](#value-proposition)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
- [Features](#features)
  - [AI Driven Predictive Analysis](#1-ai-driven-predictive-analytics)
  - [Interactive Dashboard](#2-interactive-dashboard)
  - [Simulated Reports](#3-simulated-reports)
  - [Realtime Sentiment Analysis](#4-realtime-sentiment-analysis)
- [Machine Learning Models](#machine-learning-models)
  - [Time Series Data Forecasting](#time-series-data-forecasting)
  - [Non-Linear Least Squares Optimization](#non-linear-least-squares-optimization)
- [Roadmap](#roadmap)

## About
### Problem Statement
Theme 2: Towards a highly connected Port+ Ecosystem

Demand-supply management in the container logistics ecosystem is a critical aspect of ensuring efficient operations. Firstly, it involves forecasting demand for container shipments, taking into account various factors such as seasonal fluctuations and market trends. Secondly, supply management entails optimizing the availability of containers, ensuring that there are enough containers to meet the demand at key locations and times. Thirdly, it involves capacity management for container ships and terminals, making sure that the infrastructure can handle the expected volume of shipments. Effective demand-supply management helps prevent congestion at ports, reduces shipping delays, and lowers operational costs. This balance between supply and demand is essential for maintaining the fluidity and reliability of container logistics.
​
How can digital solutions powered by data and AI optimize demand and supply in the logistics ecosystem for seamless flow of cargo?

### Value Proposition
Logiflow brings immense value to PSA and its partners in the supply chain ecosystem by providing accurate estimations of key port operation metrics. It helps to prevent congestion at ports, reduces shipping delays, and lowers operational costs, resulting in enhanced reliability and efficiency throughout the supply chain.

### Tech Stack
![ReactJS](https://img.shields.io/badge/ReactJS-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![Nivo Charts](https://img.shields.io/badge/Nivo_Charts-007ACC.svg?style=for-the-badge&logo=svg&logoColor=white)
![REcharts](https://img.shields.io/badge/REcharts-React_Charting_Library-orange?style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

- Frontend: ReactJS deployed on Vercel
- Backend: Flask deployed on Render
- Data and AI: Python libraries for data analysis and machine learning (pandas, numpy, scipy, statsmodel)

### Architecture
Logiflow utilizes a client-server architecture with ReactJS for the frontend and Flask for the backend. Data analysis and AI-driven predictions are integrated to optimize demand and supply. 

## Features

### 1. AI-Driven Predictive Analytics
Logiflow leverages cutting-edge AI algorithms to provide predictive analytics for key port metrics. 

It analyzes historical data, taking into account factors such as seasonality, market trends, and historical vessel arrivals, cargo, and container throughput. By harnessing the power of AI and data, Logiflow accurately predicts future months' data, allowing port operators and logistics professionals to make informed decisions. To ensure scalability

This feature ensures that container logistics operations are well-prepared for fluctuations in demand and can optimize resource allocation accordingly.

### 2. Interactive Dashboard
Logiflow offers an intuitive and interactive dashboard that empowers users with real-time insights into critical port metrics. 

The dashboard displays historical and predicted data for vessel arrivals, total cargo, container throughput, and cargo breakdown. Users can easily navigate through the dashboard to access detailed information, enabling them to make data-driven decisions efficiently. 

With this feature, port operators can monitor the current state of their operations, compare it with historical data, and plan for the future with confidence.

### 3. Simulated Reports
Logiflow goes beyond data analysis by providing a unique simulated reports feature. 

Users can experiment with different operational cost scenarios and observe the direct impact on container throughput. This functionality allows logistics professionals to fine-tune their strategies, optimize resource allocation, and reduce operational costs while maintaining the desired level of container throughput. 

Simulated reports provide valuable insights into cost-effectiveness, ensuring that port operations are both efficient and financially sustainable.

### 4. Realtime Sentiment Analysis
Logiflow provides realtime updates on latest port-related news happening worldwide.

It scrapes the website - Journal of Commerce - for articles relating to ports.
A sentiment score for each article is generated based on selected high-risk keywords picked up from the title of the article which ranks them by importance level. The dashboard displays these latest news ranked by sentiment scores.

Sentiment analysis provide insights into real-world circumstances which data alone cannot predict. With these news, a better decision can be made with regards to both data-driven and human-driven analysis.


## Machine Learning Models
### Time Series Data Forecasting
Based on data, the Total Cargo per month can be forecasted with historical time series analysis

Steps:

**1. Seasonal Decomposition of Time Series using Loess**

Since cargo can be affected by many factors such as demand and major news - most often seasonal, the time-series data can be further decomposed into 3 components.
- Seasonal
- Trend 
- Residual
Which can be additive (+) or multiplicative (*)

From the initial graph, it can be seen that it has a sort of linear trend therefore the additive model is chosen
```
y(t) = Trend + Seasonal + Residual
```

The model is decomposed with a period of 12 - which signifies the 12 months of the year to which demand has a relation to the season of the year.

After decomposition, it can be seen that Trend and Residual components has no well-defined pattern while the Seasonal component has a recurring pattern of period 12.

The Seasonal components can be broken up into its recurring pattern and forecasted accordingly

**2. Autoregressive Integrated Moving Average ARIMA models**

Since the Trend and Residual components have no well-defined pattern, ARIMA can be used to predict future trends of the 2 components.

It is defined as ARIMA(p,d,q) where p, d, and q denote the number of lagged (or past) observations to consider for autoregression, the number of times the raw observations are differenced, and the size of the moving average window respectively.

The model removes any correlation and collinearity in the data and makes the time-series data stationary through differenciation. It figures out the importance of past fluctuations, includes overall trends and deals with smoothening the effect of outliers. Thus, ARIMA is best used to capture historical trends, seasonality, randomness, and other non-static behavior that humans miss. In our case, it will be the perfect fit for our data.

To determine the parameters d, p, q:
- the order of differencing d:
  - by checking against the partial autocorrelation plot
  - measure different plots of differing differentiated data
  - p-value obtained by the Augmented Dickey-Fuller test can be used to reject the null hypothesis that the given time-series data is non-stationary

- the order for autoregressive model p:
  - inspecting the partial autocorrelation plot
  - choose the order of p based on the most significant lag in the plot

- size of moving average window q:
  - inspecting the autocorrelation plot instead
  - look at the number of lags crossing the threshold
  - high correlation contribute more and will be enough to predict future values

After the above deterministic procedures, the p,d,q values was calculated to be:
Trend: (2,2,3)
Residual: (1,2,1)

**3. Validation**

Mean absolute scaled error can be used to calculate the accuracy of forecasts for time-series data

MASE considers the data the model was trained in the form of 1st order changes or differences which make it a good measure for time-series data irrespective of scale or time.

Calculating the MASE for a partitioned dataset into training and test datasets, the MASE is 0.62212927. Which has a value lower than 1, indicating that the algorithm performs well compared to a naive forecast.

**4. Forecasting**

The acceptable forecasting range is given to be 1-12 datapoints. This is because a significant large forecasting range would prove to be inaccurate and unrealistic in case of external factors.

Predicting up to a year in advance would be the ideal forecast for any decision making required based on historical data.

Adding the 3 components up after predicting on each model, the future values can be predicted.

### Non-Linear Least Squares Optimization
The aim of this model is to maximize container throughput with respect to operational costs.

The operational costs considered may include:
- maintenance costs
- labor costs
- training costs
- equipment costs
- more

It is assumed that operational costs has a logarithmic relationship to container throughput. This is because the container throughput plateaus with increasing operational costs. It will come to a point where the container throughput will reach a limit no matter the funds invested. 

The data values of operational costs are estimated based on a few estimated data points sourced online and taking the average. This might not be realistic but the data of operational costs can be replaced with PSA's own data. 

The few data points are extrapolated with a logarithmic function:
```
throughput = a * log(cost) + b
```

The constants a and b are obtained using non-linear least squares optimization

From this function, the throughput can be estimated from the operational costs. This allows user to execute any sensitivity analysis. For further accuracy, a recommended range with the latest operational costs as the center is used to restrict any analysis on the extreme ends on the upper and lower bounds.

## Roadmap
Logiflow's future roadmap includes further enhancements in demand forecasting, advanced AI integration, and scalability to accommodate the growing needs of PSA and the entire supply chain ecosystem. We are committed to ensuring the seamless flow of cargo and reducing operational complexities in container logistics.

## ✍🏻 Contributors
* Benjamin Toh [@bentohset](https://github.com/bentohset)
* Ryan Ong [@ryanongwx](https://github.com/ryanongwx)
* Ryan Lim [@Seibell](https://github.com/Seibell)
* Wang Yu Teng [@WangYuTengg](https://github.com/WangYuTengg)

