from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'GMII.views.home', name='home'),
    # url(r'^GMII/', include('GMII.foo.urls')),
   #url(r'^gmii/$', 'serve.views.gmii_main'),

    url(r'^get_geometry/$', 'gm-er.views.get_geometry'),
    url(r'^set_geometry/$', 'gm-er.views.set_geometry'),
    url(r'^delete_geometry/$', 'gm-er.views.delete_geometry'),
    url(r'^get_comments/$', 'gm-er.views.get_comments'),
    url(r'^add_comment/$', 'gm-er.views.add_comment'),
    url(r'^set_point/$', 'gm-er.views.set_point'),
    url(r'^get_points/$', 'gm-er.views.get_points'),
    url(r'^update_geometry/$', 'gm-er.views.update_geometry'),
    url(r'^set_route/$', 'gm-er.views.set_route'),
    url(r'^get_route/$', 'gm-er.views.get_route'),
    # Uncomment the admin/doc line below to enable admin documentation:
     #url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),
    
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': '/home/siem/projects/GMII/media/'}),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': '/home/siem/Dropbox/_projects/geodjango/media/'}),
)
