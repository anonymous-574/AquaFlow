# populate_db.py
from datetime import datetime, timedelta
from models import db, User, Supplier, Society, ConservationTip, SupplierOffer, Challenge, UserChallenge, WaterReading, TankerOrder, LeakEvent
from app import app

with app.app_context():
    db.create_all()  # Ensure tables exist
    db.drop_all()  # Clear existing data for fresh populate
    db.create_all()

    # Add a society
    society = Society(name="Green Valley", address="123 Main St, Mumbai")
    db.session.add(society)
    db.session.commit()  # Commit to get ID

    # Add users
    user = User(username="john_doe", email="john@example.com", role="user", society_id=1, area="Andheri", city="Mumbai", lat=19.0760, long=72.8777)
    user.set_password("securepassword123")
    supplier_user = User(username="supplier1", email="supplier1@example.com", role="supplier")
    supplier_user.set_password("supplierpass123")
    admin_user = User(username="admin1", email="admin1@example.com", role="society_admin", society_id=1, area="Andheri", city="Mumbai", lat=19.0760, long=72.8777)
    admin_user.set_password("adminpass123")
    db.session.add_all([user, supplier_user, admin_user])
    db.session.commit()

    # Add suppliers
    supplier1 = Supplier(name="WaterCorp", contact="+91-1234567890", verified=True, photo_url="https://placeholder.com/watercorp.jpg", area="Andheri", city="Mumbai", rating=4.5, num_reviews=20, lat=19.1, long=72.9)
    supplier2 = Supplier(name="AquaSupply", contact="+91-0987654321", verified=True, photo_url="https://placeholder.com/aquasupply.jpg", area="Bandra", city="Mumbai", rating=4.2, num_reviews=15, lat=19.05, long=72.85)
    db.session.add_all([supplier1, supplier2])
    db.session.commit()

    # Add supplier offers
    offer1 = SupplierOffer(supplier_id=1, quantity=1000.0, cost=500.0)
    offer2 = SupplierOffer(supplier_id=1, quantity=5000.0, cost=2000.0)
    offer3 = SupplierOffer(supplier_id=2, quantity=2000.0, cost=900.0)
    offer4 = SupplierOffer(supplier_id=2, quantity=10000.0, cost=3500.0)
    db.session.add_all([offer1, offer2, offer3, offer4])

    # Add conservation tip
    tip = ConservationTip(
        title="Use Rainwater Harvesting",
        content="Install a rainwater harvesting system to reduce dependence on tankers.",
        location_specific="urban_india"
    )
    db.session.add(tip)

    # Add challenges
    challenge1 = Challenge(name="No Drip Day", short_desc="Go a full day without unnecessary leaks", full_desc="Challenge yourself to check and fix all leaks in your home for one day to save water.", water_save_potential=50.0, eco_points=10)
    challenge2 = Challenge(name="Short Shower Challenge", short_desc="Limit showers to 5 minutes", full_desc="Reduce shower time to save significant amounts of water daily.", water_save_potential=100.0, eco_points=20)
    db.session.add_all([challenge1, challenge2])
    db.session.commit()

    # Add user challenges
    uc1 = UserChallenge(user_id=1, challenge_id=1, progress=50.0, status='active', start_date=datetime.utcnow() - timedelta(days=2))
    uc2 = UserChallenge(user_id=1, challenge_id=2, progress=100.0, status='completed', start_date=datetime.utcnow() - timedelta(days=10), end_date=datetime.utcnow() - timedelta(days=5), water_saved=100.0, eco_points_earned=20)
    db.session.add_all([uc1, uc2])

    # Add water readings
    now = datetime.utcnow()
    reading1 = WaterReading(user_id=1, society_id=1, reading=100.0, timestamp=now - timedelta(days=2))
    reading2 = WaterReading(user_id=1, society_id=1, reading=150.0, timestamp=now - timedelta(days=1))
    reading3 = WaterReading(user_id=1, society_id=1, reading=200.0, timestamp=now)
    reading4 = WaterReading(user_id=3, society_id=1, reading=120.0, timestamp=now - timedelta(days=1))
    db.session.add_all([reading1, reading2, reading3, reading4])

    # Add tanker orders
    order1 = TankerOrder(user_id=1, supplier_id=1, society_id=1, volume=5000.0, price=2000.0, status='pending', delivery_time=now + timedelta(hours=2))
    order2 = TankerOrder(supplier_id=2, society_id=1, volume=10000.0, price=3500.0, status='en_route', delivery_time=now + timedelta(hours=1))
    db.session.add_all([order1, order2])

    # Add leak events
    leak1 = LeakEvent(user_id=1, detected_date=now - timedelta(days=1), estimated_loss=15.0, severity='moderate', description='Unusual flow detected')
    db.session.add(leak1)

    db.session.commit()