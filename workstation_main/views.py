from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Max
import datetime
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
import urllib.parse
from .models import *
from django.contrib.auth.decorators import login_required
import requests
import json,sys

headers = {"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MzI1ZjMzZC04Njc4LTRlNDUtOGE3Yi1jNzdjODRkOWQyNzYiLCJqdGkiOiIwMTg4OGRhZGU1NTJlMzdiMzM1MzQ4OGMxNjQ4YTNmMDY3ZWU2NTYzMGQ4Mzg0YjE4NDUyMTMyY2I1YWE4NzRjNGExMTAyM2I1Zjk3NDlmNCIsImlhdCI6MTYxODQ2NTkwNywibmJmIjoxNjE4NDY1OTA3LCJleHAiOjE2NTAwMDE5MDcsInN1YiI6IiIsInNjb3BlcyI6W119.gpJ8ueHBwoxLNuV7zgIcyvAamXFPEJIiLYE70zqOUYfpOenX1rSbCzsFwp87VVA-wcu6OOaEOvYQ4YOF_Qr3Ff0aXzXVpXwCpauL7D6IXMWOVllVEn0Oj8hgaHrel2cS3AWQOYChgSyEr9aOOP_NiorZyDw7Sd-ozeV9djJoboph-i5RoqfIxXyYXSSA_gSB8v2k1AkV9MpJTeJhu7-xAAdOiQf-yPO8AmlShCSqpYbwGOrcoigGEE9Ty6UvX7BUNX5KOpmnar5T_07ytwwZzPHD-EBLybypFC-EW1wKW_G-eOc5YRR8pxZaa2xYErI_RIUlQ6UoVc-ndiclutXsP0_8KtkvuMB2qHPO_dKV_27jPGsoDGvT0ohNoTWVmeXQ-nwMdh3MswmSpt6EUG5yB38sXmmve0M_3s1zCCPaaF5Y9ZlUOh9GKQwdzmIxKX2CtT_bwogczqvlzst0dY0_uKd2qPvSjSWROb0PSZD06AQLbgQNd5oFlrJPmxRshxiNmFxsqZLCNSbChT_92GrZVWGtP4ep8yNksgQGLTjmuUJjGHsNYmVW8TgKWxcmxSHo_yulcb04zRzvDbp4lf4FaeQdydBf3fHCf765rlhF4X_sFGnqhSZdRLOvIq1DTqthxX-woUksXKaJptbF1nyQM6Up113H7np7oOJKLfBTh_w"}


# Create your views here.


def index(request):
    if request.user.is_authenticated:
        return render(request,'workstation_main/journal_data.html')
        
    else:
        return render(request,'workstation_main/login.html')
def login_view(request):
    if request.method == "POST":
        username=request.POST["Inputusername"]
        password=request.POST["InputPassword"]
        user= authenticate(request,username=username,password=password)
        if user is not None:
            login(request,user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request,'workstation_main/login.html',{
                'message':'Incorrect Username or Password'
            })
    else:
        return render(request,'workstation_main/login.html')

def register_view(request):
    if request.method == "POST":
        print(request.POST)
        username=request.POST["Inputusername"]
        email=request.POST["InputEmail"]
        password=request.POST["InputPassword"]
        repassword=request.POST["ReInputPassword"]
        #return render(request,'workstation_main/register.html',{'message':'username already taken'})
        
        
        if password!=repassword:
            return render(request,'workstation_main/register.html',{'message':'Password didn\'t match'})
        else:
            try:
                user=User.objects.create_user(username,email,password)
                user.save()
            except IntegrityError:
                return render(request,'workstation_main/register.html',{'message':'username already taken'})
            return HttpResponseRedirect(reverse("login"))
    else:
        return render(request,'workstation_main/register.html')
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

def podcast_api_search(request,name):
    print(name)
    name=urllib.parse.quote_plus(name)
    url='https://api.podchaser.com/graphql'
    query='''
          query{
            apiVersion
            episodes(
                first:10
                page:0
                searchTerm:"'''+name+'''"
                sort:{
                    sortBy:RELEVANCE
                    direction:ASCENDING
                }
            )
            {
                data
                {   id
                    title
                    description
                    imageUrl
                    audioUrl
                }
            }
        }
          ''' 
    get_access_token="""
                        mutation {
    requestAccessToken(
        input: {
            grant_type: CLIENT_CREDENTIALS
            client_id: "9325f33d-8678-4e45-8a7b-c77c84d9d276"
            client_secret: "tAQXy25SkPgqzyvnItWUdzAdeg9hEMtR3CVfndic"
        }
    ) {
        access_token
        token_type
        expires_in
    }
    }"""
   
    #r=requests.post(url,json={'query':get_access_token})
    #r=json.loads(r.text)
    #print(r)
    headers = {"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MzI1ZjMzZC04Njc4LTRlNDUtOGE3Yi1jNzdjODRkOWQyNzYiLCJqdGkiOiI4YzUyZWEzMDZkNGU5YmEyZjZjZWYyNGIwNGNhZTQ4YWZlMzY2OTlhMmEzNjk5MjkzNzg3Y2FjMTYyYzg1ZGExMGE3MGMyNGE4NmYyMzI1NSIsImlhdCI6MTYxODQ3NjgyNSwibmJmIjoxNjE4NDc2ODI1LCJleHAiOjE2NTAwMTI4MjUsInN1YiI6IiIsInNjb3BlcyI6W119.kcGkWiqXFs3-STj3sXxkcRlhgDrZsy7X1go3lkqSD5OIRAiqvdBFnHffgHd4HTeC5d2KHLtKeNpBB5WpkhwkKctmyIBbKypp8BVD-PiONjBAwilpSbjQn478OY8jSH5XFxN0rg2wcjyePN8fU5OGv4E5z6r_N3apQ5iCdZ6wCLR3F_Bkci8qyRkFkA9VrlnEqH9lJGWNlX5LJPEMWeN74MUjgWcg2kPiVCd9Hzok5Zo0ufC-jUol1GBIolQzY8hNwCWt0uZU9PMks-6eYSqYMA7U1de4Ay_PZm8EETUJEPbVtpIKUDVOf9z3QS8SnRYX51dnj-mVB9n3Mk72K9degwLBResJdG5rOqKbhVxd_kZzWhn2xLjc4i5k3idk5VfP0dXa4plEE-5ytveATydaB8fSi9YeSICS5msCNwzgvXOzqzl6bdqsatUmLWE6bIedTJuuGDfyNeftnEv6OJx2QU5t0i7XnRsgqpDyIoCLzScIaACqSLe-GNIljzHo7D3XxLqH_Wq5DplC7qPYT37cjc5CJzT36Hu6BGM7pT75fKxVaQn0YjoWWstPRxfsoavliSZsaNvPQypWqPrbg4ydxxWzmk6Q_Xj942l0Xkz5fxdnyc1KhzovdUiYMJOizOAlxzJSZhDYSXpbqKKc5kI2Ekx4fh5dnRq1UCCIwBMHqIw"}

    r=requests.post(url,json={'query':query},headers=headers)
    print("data\n")
    print(r.status_code)
    #print(json.loads(r.text))
    #r={'data': {'apiVersion': '2', 'podcasts': {'data': [{'title': 'Cortex'}, {'title': 'Cosmic Cortex'}, {'title': 'The Cortex Labs Nootropics Podcast'}, {'title': 'Flex Cortex'}, {'title': 'Cortex Radio Shows'}, {'title': 'Full Frontal Cortex'}, {'title': 'DJ Cortex Mixtapes'}, {'title': "Clay's Cortex Podcast"}, {'title': 'Comunicação Pelo Córtex'}, {'title': 'Inside The Data Cortex'}]}}}
       
    return JsonResponse(json.loads(r.text))

@csrf_exempt
@login_required
def update(request):
    print(request.user.is_authenticated)
    print(request.user.username)
    return JsonResponse('Okay',safe=False)
