from datetime import datetime, timedelta
from models import db, User, Supplier, Society, ConservationTip, SupplierOffer, Challenge, UserChallenge, WaterReading, TankerOrder
from app import app

with app.app_context():
    db.drop_all()  # Clear existing data for fresh populate
    db.create_all()  # Ensure tables exist

    # Add a society
    society = Society(name="Green Valley", address="123 Main St, Mumbai")
    db.session.add(society)
    db.session.commit()  # Commit to get ID

    # Add users
    user1 = User(username="john_doe", email="john@example.com", role="user", society_id=1, area="Andheri", city="Mumbai", lat=19.0760, long=72.8777)
    user1.set_password("securepassword123")
    user2 = User(username="alice_smith", email="alice@example.com", role="user", society_id=1, area="Bandra", city="Mumbai", lat=19.05, long=72.85)
    user2.set_password("alicepass123")
    user3 = User(username="bob_jones", email="bob@example.com", role="user", society_id=1, area="Juhu", city="Mumbai", lat=19.09, long=72.83)
    user3.set_password("bobpass123")
    supplier_user = User(username="supplier1", email="supplier1@example.com", role="supplier")
    supplier_user.set_password("supplierpass123")
    admin_user = User(username="admin1", email="admin1@example.com", role="society_admin", society_id=1, area="Andheri", city="Mumbai", lat=19.0760, long=72.8777)
    admin_user.set_password("adminpass123")
    db.session.add_all([user1, user2, user3, supplier_user, admin_user])
    db.session.commit()

    # Add suppliers
    supplier1 = Supplier(name="WaterCorp", contact="+91-1234567890", verified=True, photo_url="https://cdn.dnaindia.com/sites/default/files/2018/04/16/672411-water-tanker-05.jpg?im=FitAndFill=(300,225)", area="Andheri", city="Mumbai", rating=4.5, num_reviews=20, lat=19.1, long=72.9)
    supplier2 = Supplier(name="AquaSupply", contact="+91-0987654321", verified=True, photo_url="https://www.hindustantimes.com/ht-img/img/2023/04/04/550x309/Mumbai--India---April-04--2023--A-water-tanker-sup_1680635692044.jpg", area="Bandra", city="Mumbai", rating=4.2, num_reviews=15, lat=19.05, long=72.85)
    supplier3 = Supplier(name="PureFlow", contact="+91-1122334455", verified=True, photo_url="https://www.hindustantimes.com/ht-img/img/2023/05/08/550x309/Due-to-higher-water-demands--the-number-of-water-t_1683567413698.jpg", area="Juhu", city="Mumbai", rating=4.0, num_reviews=10, lat=19.09, long=72.83)
    supplier4 = Supplier(name="HydroVibe", contact="+91-6677889900", verified=True, photo_url="https://indianexpress.com/wp-content/uploads/2019/08/strike-feature.jpg", area="Vile Parle", city="Mumbai", rating=4.7, num_reviews=25, lat=19.1, long=72.85)
    db.session.add_all([supplier1, supplier2, supplier3, supplier4])
    db.session.commit()

    # Add supplier offers
    offer1 = SupplierOffer(supplier_id=1, quantity=1000.0, cost=500.0)
    offer2 = SupplierOffer(supplier_id=1, quantity=5000.0, cost=2000.0)
    offer3 = SupplierOffer(supplier_id=2, quantity=2000.0, cost=900.0)
    offer4 = SupplierOffer(supplier_id=2, quantity=10000.0, cost=3500.0)
    offer5 = SupplierOffer(supplier_id=3, quantity=1500.0, cost=700.0)
    offer6 = SupplierOffer(supplier_id=3, quantity=8000.0, cost=2800.0)
    offer7 = SupplierOffer(supplier_id=4, quantity=3000.0, cost=1200.0)
    offer8 = SupplierOffer(supplier_id=4, quantity=12000.0, cost=4000.0)
    db.session.add_all([offer1, offer2, offer3, offer4, offer5, offer6, offer7, offer8])

    # Add conservation tips
    tip1 = ConservationTip(
        title="Use Rainwater Harvesting",
        content="Install a rainwater harvesting system to reduce dependence on tankers.",
        location_specific="urban_india"
    )
    tip2 = ConservationTip(
        title="Fix Leaky Faucets",
        content="Repair dripping faucets to save up to 20 liters of water per day.",
        location_specific="urban_india"
    )
    tip3 = ConservationTip(
        title="Use Bucket Bathing",
        content="Opt for bucket baths instead of showers to conserve water.",
        location_specific="urban_india"
    )
    db.session.add_all([tip1, tip2, tip3])

    # Add challenges
    challenge1 = Challenge(name="No Drip Day", short_desc="Go a full day without unnecessary leaks", full_desc="Challenge yourself to check and fix all leaks in your home for one day to save water.", water_save_potential=50.0, eco_points=10)
    challenge2 = Challenge(name="Short Shower Challenge", short_desc="Limit showers to 5 minutes", full_desc="Reduce shower time to save significant amounts of water daily.", water_save_potential=100.0, eco_points=20)
    challenge3 = Challenge(name="Low-Flow Day", short_desc="Use low-flow fixtures for a day", full_desc="Switch to low-flow showerheads and faucets for a day to minimize water usage.", water_save_potential=80.0, eco_points=15)
    challenge4 = Challenge(name="Reuse Greywater", short_desc="Reuse water from washing", full_desc="Collect water from washing dishes or clothes to use for plants or cleaning.", water_save_potential=60.0, eco_points=12)
    db.session.add_all([challenge1, challenge2, challenge3, challenge4])
    db.session.commit()

    # Add user challenges for john_doe
    uc1 = UserChallenge(user_id=1, challenge_id=1, progress=50.0, status='active', start_date=datetime.utcnow() - timedelta(days=2))
    uc2 = UserChallenge(user_id=1, challenge_id=2, progress=100.0, status='completed', start_date=datetime.utcnow() - timedelta(days=10), end_date=datetime.utcnow() - timedelta(days=5), water_saved=100.0, eco_points_earned=20)
    uc3 = UserChallenge(user_id=1, challenge_id=3, progress=20.0, status='active', start_date=datetime.utcnow() - timedelta(days=1))
    uc4 = UserChallenge(user_id=1, challenge_id=4, progress=0.0, status='pending', start_date=datetime.utcnow())
    # Add user challenges for alice_smith
    uc5 = UserChallenge(user_id=2, challenge_id=2, progress=80.0, status='active', start_date=datetime.utcnow() - timedelta(days=3))
    db.session.add_all([uc1, uc2, uc3, uc4, uc5])

    # Add water readings for john_doe (user_id=1) only
    now = datetime.utcnow()
    readings = []
    for day in range(120, -1, -1):  # Last 120 days
        base_time = now - timedelta(days=day)
        # Add 2-3 readings per day for variety
        for hour in [8, 16, 22]:  # Morning, afternoon, evening
            reading_value = 100.0 + (30 - day) * 50 + (hour % 10) * 5  # Incremental readings
            readings.append(
                WaterReading(
                    user_id=1,
                    society_id=1,
                    reading=reading_value,
                    timestamp=base_time.replace(hour=hour, minute=0, second=0, microsecond=0)
                )
            )
    db.session.add_all(readings)

    # Add tanker orders
    order1 = TankerOrder(user_id=1, supplier_id=1, society_id=1, volume=5000.0, price=2000.0, status='pending', delivery_time=now + timedelta(hours=2))
    order2 = TankerOrder(supplier_id=2, society_id=1, volume=10000.0, price=3500.0, status='en_route', delivery_time=now + timedelta(hours=1))
    order3 = TankerOrder(user_id=2, supplier_id=3, society_id=1, volume=1500.0, price=700.0, status='delivered', delivery_time=now - timedelta(days=1))
    order4 = TankerOrder(supplier_id=4, society_id=1, volume=12000.0, price=4000.0, status='pending', delivery_time=now + timedelta(hours=4))
    order5 = TankerOrder(user_id=1, supplier_id=1, society_id=1, volume=1000.0, price=500.0, status='en_route', delivery_time=now + timedelta(hours=3))
    db.session.add_all([order1, order2, order3, order4, order5])
    
    db.session.commit()