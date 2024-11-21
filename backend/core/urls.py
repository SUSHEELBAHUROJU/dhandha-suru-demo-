from django.urls import path
from . import views

urlpatterns = [
    # Auth endpoints
    path('auth/register/', views.register_user, name='register'),
    path('auth/register/fintech/', views.register_fintech, name='register-fintech'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Dashboard endpoints
    path('dashboard/stats/', views.get_dashboard_stats, name='dashboard-stats'),
    
    # Retailers endpoints
    path('retailers/', views.get_retailers, name='retailers-list'),
    path('retailers/search/', views.search_retailers, name='retailers-search'),
    path('retailers/recent/', views.get_recent_retailers, name='recent-retailers'),
    path('retailers/<int:retailer_id>/', views.get_retailer_details, name='retailer-details'),
    
    # Dues endpoints
    path('dues/', views.get_dues, name='dues-list'),
    path('dues/create/', views.create_due, name='create-due'),
    path('dues/<int:due_id>/', views.due_detail, name='due-detail'),
    path('dues/<int:due_id>/pay/', views.make_payment, name='make-payment'),
    
    # Transaction endpoints
    path('transactions/', views.get_transactions, name='transactions-list'),
    path('transactions/history/', views.get_transaction_history, name='transaction-history'),

    # Credit Assessment endpoints
    path('credit-assessment/request/', views.request_credit_assessment, name='request-credit-assessment'),
    path('credit-assessment/status/', views.get_credit_assessment_status, name='credit-assessment-status'),
]