# Bird Spotter

## Description

This is called BirdSpotter. Users can log in and create sightings of birds in their area. V1 will just have users sign-up and sign-in to create their bird sightings. In order to create a bird sighting, users will need to input a bird's common name, their species name, the location where they spotted the bird, and a picture of the bird. Users can then see what birds they have spotted and update or delete their sightings. Users will also be able to see bird sightings from all users.

## Routes

| HTTP Method   | URL Path         | Result                | Action           |
|:--------------|:-----------------|:----------------------|:-----------------|
| POST          | /sign-in         | signs in user         | create           |
| POST          | /sign-up         | signs up user         | create           |
| DELTE         | /sign-out        | signs out user        | destroy          |
| PATCH         | /change-password | changes user password | update           |
| GET           | /birds        | shows user's birds list   | index or list    |
| POST          | /birds/`:id` | creates bird      | create           |
| PATCH         | /birds/`:id` | updates bird      | update           |
| DELETE        | /birds/`:id` | deletes bird      | destroy          |
| GET           | /birds-all/      | shows all birds   | index or list    |


### ERD
![ERD](https://i.imgur.com/m5wvLUX.png)

### Technologies Used
  * Mongodb
  * Express
  * Jquery
  * Node
  * HTML/CSS
  * Bootstrap
