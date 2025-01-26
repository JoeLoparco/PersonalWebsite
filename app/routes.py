from app import appInstance
from flask import render_template

@appInstance.route('/') # Home page 'Route'
def home(): # Def home function for home page
    return render_template('index.html') # Returns Asscoaited HTML File using flask library render_template
@appInstance.route('/miniJavaCompiler')
def compilerProject(): # Creates Route and route function for miniJavaCompiler * NOte Route def must be immiditely after route initialization.
    return render_template('project.html')