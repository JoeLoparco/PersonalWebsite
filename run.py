#This Line imports Flask Aplitcation instance from app package (cleverley named appInstance, I know i'm bad ad naming things).
from app import appInstance 

if __name__ == '__main__':
    #This Line runs only on localHost device.
    appInstance.run(debug=True)
    #This line runs on local network(for use when tesing Raspberry pi). 
    #app.run(host='0.0.0.0')