# Insight Message

Insight Message is an app that allows you to scrape messages from Facebook, analyze the emotions conveyed in those messages, and show you statistical results based on the data gathered.It uses React, d3.js, and Scrapy. The UI includes a word cloud, dashboard, and social graph. The sentiment analysis results are limited by possible bias towards negative emotions.
> this project is named by ChatGPT

## Demo
[![Alt text for your video](http://img.youtube.com/vi/MgZNXxkPyTU/0.jpg)](http://www.youtube.com/watch?v=MgZNXxkPyTU)

## Tools and Packages
### Frontend
- React
  - React fullpage
  - React Grid Layout
  - React Router
- Bootstrap
- d3.js

### Backend
This project is written in Python and leverages Scrapy for web scraping messages. The messages are then analyzed for sentiment using an NLP model. FastAPI is used to efficiently pass the results of the sentiment analysis.

## UI
### Word Cloud
In order to analyze the messages, the project utilizes Jieba to tokenize the text into individual words. The word count is then calculated, and a graph is generated based on the results.

### Dash Board
The sentiment analysis of the messages yields the following results:

- **Top Emotion**: The most frequently used emotion in the messages.
- **Sent Messages**: The total number of messages sent in the past 12 months.
- **Messages in Peak Month**: The total number of messages sent in the month with the highest message volume.
- **Top Contact**: The person you've contacted the most frequently based on message count (Include speeches in groups).
- **Stream Graph**: A visualization of the change in message volume over the past 12 months.
- **Donut Graph**: A visual representation of the percentage of each emotion in the messages.
- **Bar Chart**: A visual representation of the actual number of each emotion, allowing for easy comparison between different emotions.

### Social Graph
The project leverages d3.forceSimulation to generate a visualization where the radius of each circle corresponds to the amount of messages associated with each target (person or group). The color of the circle reflects the polarity of the emotion, while the distance between the circles represents a composite score that takes into account both message count and emotion. A shorter distance between two circles indicates a higher composite score, which in turn signifies a closer relationship between the person or group associated with those circles.

## Limitations and Considerations
The problem with the NLP model used in this project is that it may exhibit bias towards predicting negative emotions more frequently than positive emotions. This bias may be due to a variety of factors, such as the training data used to create the model or the algorithms used to analyze the text. As a result, the sentiment analysis results may not accurately reflect the true emotional content of the messages analyzed.

## Getting Started

```bash
git clone https://github.com/Ethan-Wu-juniper/Insight-Message.git
npm install
npm run start
```

Please note that this project's backend code is not intended for release, so there may be limitations to its functionality if you try to run it on your own device.
