from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def about():
    return render_template('index.html', section='about')

@app.route('/get-supplies')
def get_supplies():
    return render_template('index.html', section='get-supplies')

@app.route('/donate')
def donate():
    return render_template('index.html', section='donate')

@app.route('/support')
def support():
    return render_template('index.html', section='support')

if __name__ == '__main__':
    app.run(debug=True)
