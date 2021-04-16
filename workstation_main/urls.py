from django.urls import path
from . import views
urlpatterns=[
    path("",views.index,name='index'),
    path("login",views.login_view,name="login"),
    path("register",views.register_view,name="register"),
    path("logout",views.logout_view,name="logout"),
    path("search/<str:name>",views.podcast_api_search,name="podcast_search"),
    path("update",views.update,name="update_data")
    
]