# tree2hammock

The backend to the Hammock application

### GET 

To get all live events:

`/getLiveEvents?securityToken={security_token}`

### POST

To add a new event:

`/addNewEvent`

```
{
  data: {
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    activity: ''
  },
  security_token: 'xyz123'
}
```

### DELETE

To delete an event:

`/deleteEvent`

```
{
  event_id: 'MONGO_DB_DEFINED_ID',
  security_token: 'xyz123'
}
```