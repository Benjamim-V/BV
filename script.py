import pandas as pd

df = pd.read_csv('hotel_bookings.csv')


columns = ["hotel", "lead_time", "arrival_date_year", "arrival_date_month", "arrival_date_week_number","arrival_date_day_of_month", 
           "country", "market_segment", "distribution_channel", "is_repeated_guest", "booking_changes", "days_in_waiting_list", "company",
             "customer_type", "reservation_status_date"]

columns1= ["is_canceled", "arrival_date_year", "arrival_date_month", "agent", "previous_cancellations", "previous_bookings_not_canceled", "country", "deposit_type", "reservation_status"]

columns2 = ["stays_in_week_nights", "stays_in_weekend_nights", "adults", "children", "babies", "required_car_parking_spaces", "meal", "reserved_room_type", "total_of_special_requests"]

df_selected = df[columns]


df_selected1 = df[columns1]


df_selected2 = df[columns2]

df_selected.to_csv("Tabela1.csv", index=False)
df_selected1.to_csv("Tabela2.csv", index=False)
df_selected2.to_csv("Tabela3.csv", index=False)

df1 = pd.read_csv('Tabela1.csv')
df2 = pd.read_csv('Tabela2.csv')
df3 = pd.read_csv('Tabela3.csv')


df1.to_json("Tabela1.json",orient = "records", date_format = "epoch", 
double_precision = 10, force_ascii = True, date_unit = "ms", default_handler = None, indent=2)
df2.to_json("Tabela2.json",orient = "records", date_format = "epoch", 
double_precision = 10, force_ascii = True, date_unit = "ms", default_handler = None, indent=2)
df3.to_json("Tabela3.json",orient = "records", date_format = "epoch", 
double_precision = 10, force_ascii = True, date_unit = "ms", default_handler = None, indent=2)

