from app import appInstance
from flask import render_template, send_from_directory

@appInstance.route('/') # Home page 'Route'
def home(): # Def home function for home page
    return render_template('index.html') # Returns Asscoaited HTML File using flask library render_template
@appInstance.route('/miniJavaCompiler')
def compilerProject(): # Creates Route and route function for miniJavaCompiler * NOte Route def must be immiditely after route initialization.
    return render_template('miniJavaCompiler.html')
@appInstance.route('/embeddedXinuOS')
def osProject(): # Creates Route and route function for miniJavaCompiler * NOte Route def must be immiditely after route initialization.
    return render_template('xinuOS.html')
@appInstance.route('/rustPythonJIT')
def rustPyJitComp(): # Creates Route and route function for miniJavaCompiler * NOte Route def must be immiditely after route initialization.
    return render_template('rustPyJit.html')
@appInstance.route('/pixelEditor')
def videoGames():
    return render_template('pixelEditor.html') 
@appInstance.route('/static/<path:path>') # allows routing to send http request to our static folder(allows us to grab our react componenets)
def send_static(path):
    return send_from_directory('static', path)
@appInstance.route('/laptopPrice')
def laptopanalysis():
    return render_template('laptopPrice.html')
@appInstance.route('/aboutMe')
def aboutMe():
    return render_template('aboutMe.html')
@appInstance.route('/resume')
def resume():
    return render_template('resume.html')
