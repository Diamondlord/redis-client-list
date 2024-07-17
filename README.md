# node CLI for getting unique IP of all connected Clients

## Usage
`npx redis-client-list -h localhost -p 6379`

Output per connection type:
```
normal [
'1.1.1.3',   '1.1.1.4',
'1.1.1.5',
]
multi commands executed 10
pubsub [ '1.1.1.2' ]
multi commands executed 0
master [ '1.1.1.1']
multi commands executed 0
```

