from fusiontables.src.authorization.clientlogin import ClientLogin
from fusiontables.src import ftclient
from fusiontables.src.sql.sqlbuilder import SQL 
#import urllib, urllib2

class FusionTables():
    
    def __init__(self, geometry):
        self.geometry = geometry
        
        username = ""
        password = ""
        
        try:  
            token = ClientLogin().authorize(username, password)
            self.ft_client = ftclient.ClientLoginFTClient(token)
        except:
            print "Google token generation failed.. "
            
        
        
        
        
    def save(self):
        tableid = 968066
        rowid = int(self.ft_client.query(SQL().insert(tableid, {
                'Text':'mystring', 
                'Number': 12, 
                'Location':self.geometry})).split("\n")[1])
        
        return rowid
               
        #return self.geometry
        
#auth_uri = 'https://www.google.com/accounts/ClientLogin'
##    authreq_data = urllib.urlencode({
##        'Email': username,
##        'Passwd': password,
##        'service': 'fusiontables',
##        'accountType': 'HOSTED_OR_GOOGLE'})
#auth_req = urllib2.Request(auth_uri, data=authreq_data)
#auth_resp = urllib2.urlopen(auth_req)
#auth_resp_body = auth_resp.read()
#
#auth_resp_dict = dict(
#        x.split('=') for x in auth_resp_body.split('\n') if x)
#
#auth = auth_resp_dict['Auth']
#
#
#url = 'https://www.google.com/fusiontables/api/query'
#query = 'SHOW TABLES'
#encoded = urllib.urlencode({'sql': query})
#query_url = url+ "?" + encoded
#
#header = {'Authorization': 'GoogleLogin auth=' + auth}
#request = urllib2.Request(query_url, headers=header)
#response = urllib2.urlopen(request)
#
#print response.read()
#
##print response.read()