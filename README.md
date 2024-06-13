# d3-visualization-nexus
This is a collection of interactive data visualizations from around the web, made using the D3.js library.  Whether you are a data pro or just love seeing info come alive, this repo has tons of great examples for you to explore. 

The code is presented in vanilla JavaScript to make it more accessible.

# How to use?
To run the vanilla JavaScript and HTML code from this repository, you can follow these steps:

**Download the code**: You can either download the entire repository from the GitHub link provided, or access the individual example pages on the website and save the HTML and JavaScript files locally.

**Set up a local web server**: Since the examples likely use D3.js and other JavaScript libraries, you'll need to run the code through a local web server to avoid cross-origin restrictions. You can use a simple local server like the built-in Python SimpleHTTPServer or Node.js's http-server.

Python SimpleHTTPServer:
Open a terminal or command prompt and navigate to the directory where you saved the files.
Run the command python -m SimpleHTTPServer 8000 (for Python 2.x) or python -m http.server 8000 (for Python 3.x).

Node.js http-server:
Install Node.js if you haven't already.
Open a terminal or command prompt and navigate to the directory where you saved the files.
Run the command npx http-server.

Alternatively:
In Pycharm, you can load the downloaded directory. When you open the index.html, you will see on the right upper side browser options to run the examples.

**Open the examples in a web browser**: Once the local server is running, you can open your web browser and navigate to http://localhost:8000/ to see the list of available examples. Click on the specific example you want to run, and it should load in your browser.

**Interact with the examples**: The examples should be interactive, allowing you to explore the data visualizations and their various features, such as zooming, panning, brushing, and more.

**Inspect the code**: You can right-click on the page and select "View Source" (or use your browser's developer tools) to see the HTML and JavaScript code that powers the visualization. This can be helpful for understanding how the examples are built and potentially modifying them for your own use cases.

Remember, the specific implementation details may vary slightly between the original Observable examples and the vanilla JavaScript versions, but the overall functionality should be the same.


# Why to use?

One of the biggest strengths of D3 is its extensive example gallery. This gallery makes it easier for beginners to try out various data visualizations using D3. However, in the author's opinion, integrating D3 with Observable (which is a great interactive environment) actually makes it more difficult to directly use the D3 examples in regular JavaScript code.

Unlike Python in Jupyter Notebook, where you can simply copy and paste code from examples to make it runnable, the process is not as straightforward with D3 in Observable. While there is a way to convert Observable code to plain JavaScript, the author finds this conversion to be time-consuming, at least from their perspective as a visualization researcher.

Additionally, embedding Observable code is an option, but may not be preferred in certain situations, such as to avoid the extra dependency on Observable.

This repository aims to lower the barrier for beginners to try and learn D3, by providing a way to easily experiment with the D3 example gallery code without having to spend time converting it for use in regular JavaScript projects, research work, etc.
