# User Interface

A project to explore the way to develop a user interface using:
- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [Tailwind](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/) 

## Getting started


## References

- [How to dockerize your React project](https://www.docker.com/blog/how-to-dockerize-react-app/)

## Appendix

### React

#### Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##### Available Scripts

In the project directory, you can run:

###### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

##### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

###### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

###### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

##### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



## API Documentation

This API provides endpoints to manage cycling competitions and check system status.

### Base URL
`http://localhost/api/v1`

**Note** For development, the API is available on port 5000.

---

### Endpoints

#### 1. Get API Version
Returns the current version of the API.

* **URL:** `/version`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    {
      "version": "1.0.0",
      "name": "app",
      "status": "ok"
    }
    ```

### 2. List All Competitions
Retrieves a list of all available competitions.

* **URL:** `/competitions`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Tour de France 2026",
        "filename": "tour_de_france_2026.db",
        "date": null,
        "status": "active",
        "createdAt": "2025-12-31T20:41:12.602Z",
        "updatedAt": "2026-01-01T18:34:26.954Z"
      }
    ]
    ```

### 3. Create a Competition
Adds a new competition to the system.

* **URL:** `/competitions`
* **Method:** `POST`
* **Header** `Content-Type: application/json`
* **Request Body (JSON):**

| Field  | Type   | Required | Description                |
| :----- | :----- | :------- | :------------------------- |
| `name` | string | **Yes** | The name of the competition |

* **Example Request:**
    ```json
    {
      "name": "Tour de France 2026"
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "id": "tour_de_france_2026"
    }
    ```
* **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Property 'name' is required"
    }
    ```

### 4. Get competition information
Retrieves all information about a competition

* **URL:** `/competitions/:id`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "Tour de France 2026",
      "filename": "tour_de_france_2026.db",
      "date": null,
      "status": "active",
      "createdAt": "2025-12-31T20:41:12.602Z",
      "updatedAt": "2026-01-01T18:34:26.954Z",
      "configuration": {
        "stages": [
          {"order": "1", "name": "Etape 1", "distance": 150.1,  "date": "2026-07-13"},
          {"order": "2", "name": "Etape 2", "distance": 120,    "date": "2026-07-14"},
        ],
        "annex": [
          {"name": "points",        "type": "points",       "priority": 1, "categories": [{"name": "sprint","points": [5,3,1]}]},
          {"name": "GPM",           "type": "points",       "priority": 2, "categories": [{"name": "cat1","points": [5,3,1]},{"name": "cat2", "points": [3,1]}]},
          {"name": "Jeunes",        "type": "filter",       "priority": 3, "filter": "age < 23"},
          {"name": "Equipe",        "type": "team",         "priority": 4, "nracers": "2"},
        ]
      },
      "events" : [
        {
          "stage": "1",
          "annex": [
            {"name": "points", "category": "sprint",  "distance": 50.5,   "points": [5,3,1]},
            {"name": "GPM",    "category": "cat1",    "distance": 62.4,   "points": [5,3,1]},
            {"name": "points", "category": "sprint",  "distance": 100.4,  "points": [5,3,1]},
            {"name": "GPM",    "category": "cat2",    "distance": 85.3,   "points": [3,1]}
          ],
          "bonifications": [
            {"name": "Arrivée", "distance": 150.1, "time": [10,6,4], "finish": true}
          ]
        }
      ],
      "racers": [
        {"bib": "1",  "firstname": "Paul",    "lastname": "POULE", "team": "UAE",   "age": 25, "uciID": "1002563585", "ffcID": ""},
        {"bib": "2",  "firstname": "Pierre",  "lastname": "PONCE", "team": "UAE",   "age": 30, "uciID": "1012356984", "ffcID": ""}
        {"bib": "11", "firstname": "René",    "lastname": "TAUPE", "team": "Visma", "age": 22, "uciID": "1007896325", "ffcID": ""}
      ],
      "rankings": [
        {
          "stage": "1", 
          "ranking": [
            {"position": 1, "bib": "1",   "time": "01:25:34", "status": "done", "bonifications": [10], "penalties": []},
            {"position": 2, "bib": "11",  "time": "01:25:45", "status": "done", "bonifications": [6],  "penalties": []},
            {"position": 3, "bib": "2",   "time": "01:28:10", "status": "done", "bonifications": [4],  "penalties": []}
          ],
          "general": [
            {"position": 1, "bib": "1",   "time": "01:25:34", "millis": 0, "cumulated": 1, "last": 1, "status": "done"},
            {"position": 2, "bib": "11",  "time": "01:25:45", "millis": 0, "cumulated": 2, "last": 2, "status": "done"},
            {"position": 3, "bib": "2",   "time": "01:28:10", "millis": 0, "cumulated": 3, "last": 3, "status": "done"}
          ],
          "teams": [
            {"name": "UAE",   "time": "02:53:44", "position": 4, "racers": ["1","2"]  },
            {"name": "Visma", "time": [],         "position": "",  "racers": []         },
          ],
          "annex": [
            {
              "name": "points", 
              "classifications": [
                {"name": "Sprint #1", "distance": 50.5,   "racers": ["11","2","1"]},
                {"name": "Sprint #2", "distance": 100.4,  "racers": ["2","11","1"]}
              ], 
              "ranking": [
                {"racer": "11", "points": 8, "victory": [1], "position": 2},
                {"racer": "2",  "points": 8, "victory": [1], "position": 3},
                {"racer": "1",  "points": 2, "victory": [0], "position": 1},
              ]
            },
            {
              "name": "GPM", 
              "classifications": [
                {"name": "Col 1", "distance": 62.4,   "racers":  ["1","11","2"]},
                {"name": "Col 2", "distance": 85.3,   "racers":  ["1","2"]}
              ], 
              "ranking": [
                {"racer": "1",  "points": 8, "victory": [1,1], "position": 1},
                {"racer": "11", "points": 3, "victory": [0,0], "position": 2},
                {"racer": "2",  "points": 2, "victory": [0,0], "position": 3},
              ]
            }
          ]
        }
      ]
    }
    ```

### 5. Get the competition configuration
Retrieves the configuration of a competition.

* **URL:** `/competitions/:id/configuration`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    {
      "stages": [
        {"name": "Etape 1", "distance": "150.1",  "date": "2026-07-13"},
        {"name": "Etape 2", "distance": "120",    "date": "2026-07-14"},
        ],
      "annex": [
          {"name": "points",        "type": "points",       "priority": 1, "categories": [{"name": "sprint","points": [5,3,1]}]},
          {"name": "GPM",           "type": "points",       "priority": 2, "categories": [{"name": "cat1","points": [5,3,1]},{"name": "cat2", "points": [3,1]}]},
          {"name": "Jeunes",        "type": "filter",       "priority": 3, "filter": "age < 23"},
          {"name": "Equipe",        "type": "team",         "priority": 4, "nracers": "2"},
        ],
      "events" : [
        {
          "stage": "1",
          "annex": [
            {"name": "points", "category": "sprint",  "distance": 50.5,   "points": [5,3,1]},
            {"name": "GPM",    "category": "cat1",    "distance": 62.4,   "points": [5,3,1]},
            {"name": "points", "category": "sprint",  "distance": 100.4,  "points": [5,3,1]},
            {"name": "GPM",    "category": "cat2",    "distance": 85.3,   "points": [3,1]}
          ],
          "bonifications": [
            {"name": "Arrivée", "distance": 150.1, "time": [10,6,4], "finish": true}
          ]
        }
      ]
    }
    ```

### 6. Configure the competition
Update the competition configuration.

* **URL:** `/competitions/:id/configuration`
* **Method:** `POST`
* **Header** `Content-Type: application/json`
* **Request Body (JSON):**

| Field     | Type   | Required | Description                |
| :-------- | :----- | :------- | :------------------------- |
| `stages` | JSON array of objects | **Yes** - Shall contain at least 1 element | The list of stages with meta-data (name, date, distance) |
| `annex` | JSON array of objects | **No** | The list of annex rankings |

* **Example Request:**
    ```json
    {
      "stages": [
        {"name": "Etape 1", "distance": "150.1",  "date": "2026-07-13"},
        {"name": "Etape 2", "distance": "120",    "date": "2026-07-14"},
        ],
      "annex": [
          {"name": "points",        "type": "points",       "priority": 1, "categories": [{"name": "sprint","points": [5,3,1]}]},
          {"name": "GPM",           "type": "points",       "priority": 2, "categories": [{"name": "cat1","points": [5,3,1]},{"name": "cat2", "points": [3,1]}]},
          {"name": "Jeunes",        "type": "filter",       "priority": 3, "filter": "age < 23"},
          {"name": "Equipe",        "type": "team",         "priority": 4, "nracers": "2"},
        ],
      "events" : [
        {
          "stage": "1",
          "annex": [
            {"name": "points", "category": "sprint",  "distance": 50.5,   "points": [5,3,1]},
            {"name": "GPM",    "category": "cat1",    "distance": 62.4,   "points": [5,3,1]},
            {"name": "points", "category": "sprint",  "distance": 100.4,  "points": [5,3,1]},
            {"name": "GPM",    "category": "cat2",    "distance": 85.3,   "points": [3,1]}
          ],
          "bonifications": [
            {"name": "Arrivée", "distance": 150.1, "time": [10,6,4], "finish": true}
          ]
        }
      ]
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "status": "ok"
    }
    ```
* **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Property 'stages' is required"
    }
    ```

### 7. Get the stage ranking
Retrieves the stage ranking.

* **URL:** `/competitions/:id/stages/:stageId/rankings`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    [
      {"position": 1, "bib": "1",   "time": "01:25:34", "status": "done", "bonifications": [10], "penalties": []},
      {"position": 2, "bib": "11",  "time": "01:25:45", "status": "done", "bonifications": [6],  "penalties": []},
      {"position": 3, "bib": "2",   "time": "01:28:10", "status": "done", "bonifications": [4],  "penalties": []}
    ]
    ```

### 8. Synchronize stage ranking
Update the stage ranking information in database.

* **URL:** `/competitions/:id/stages/:stageId/rankings`
* **Method:** `POST`
* **Header** `Content-Type: application/json`
* **Request Body (JSON):**

| Field  | Type   | Required | Description                |
| :----- | :----- | :------- | :------------------------- |
| `ranking` | JSON array of objects | **Yes** | The list of annex rankings |

* **Example Request:**
    ```json
     {
        "ranking": [
          {"position": 1, "bib": "1",   "time": "01:25:34", "status": "done", "bonifications": [10], "penalties": []},
          {"position": 2, "bib": "11",  "time": "01:25:45", "status": "done", "bonifications": [6],  "penalties": []},
          {"position": 3, "bib": "2",   "time": "01:28:10", "status": "done", "bonifications": [4],  "penalties": []}
        ]
     }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "status": "ok",
      "entries": 3
    }
    ```
* **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Invalid format"
    }
    ```

### 9. Get the annex ranking
Retrieves the annex ranking.

* **URL:** `/competitions/:id/stages/:stageId/annexes/:annexId`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    [
      {"name": "Sprint #1", "distance": 50.5,   "racers": ["11","2","1"]},
      {"name": "Sprint #2", "distance": 100.4,  "racers": ["2","11","1"]}
    ]
    ```

### 10. Synchronize annex rankings
Update the stage annex ranking information in database.

* **URL:** `/competitions/:id/stages/:stageId/annexes/:annexId`
* **Method:** `POST`
* **Header** `Content-Type: application/json`
* **Request Body (JSON):**

| Field  | Type   | Required | Description                |
| :----- | :----- | :------- | :------------------------- |
| `classifications` | JSON array of objects | **Yes** | The list of annex rankings |

* **Example Request:**
    ```json
     {
        "classifications": [
          {"name": "Sprint #1", "distance": 50.5,   "racers": ["11","2","1"]},
          {"name": "Sprint #2", "distance": 100.4,  "racers": ["2","11","1"]}
        ]
     }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "status": "ok",
      "entries": 2
    }
    ```
* **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Invalid format"
    }
    ```


### 11. Get racers
Retrieves a list of racers.

* **URL:** `/competitions/:id/racers`
* **Method:** `GET`
* **Response (200 OK):**
    ```json
    {
      "racers": [
        {"bib": "1",  "firstname": "Paul",    "lastname": "POULE", "team": "UAE",   "age": 25, "uciID": "1002563585", "ffcID": ""},
        {"bib": "2",  "firstname": "Pierre",  "lastname": "PONCE", "team": "UAE",   "age": 30, "uciID": "1012356984", "ffcID": ""}
        {"bib": "11", "firstname": "René",    "lastname": "TAUPE", "team": "Visma", "age": 22, "uciID": "1007896325", "ffcID": ""}
      ],
    }
    ```

### 12. Synchronize racers
Update the racers information in database.

* **URL:** `/competitions/:id/racers`
* **Method:** `POST`
* **Header** `Content-Type: application/json`
* **Request Body (JSON):**

| Field  | Type   | Required | Description                |
| :----- | :----- | :------- | :------------------------- |
| `racers` | Array of JSON object | **Yes** | List of racers information |

* **Example Request:**
    ```json
     {
      "racers": [
        {"bib": "1",  "firstname": "Paul",    "lastname": "POULE", "team": "UAE",   "age": 25, "uciID": "1002563585", "ffcID": ""},
        {"bib": "2",  "firstname": "Pierre",  "lastname": "PONCE", "team": "UAE",   "age": 30, "uciID": "1012356984", "ffcID": ""}
        {"bib": "11", "firstname": "René",    "lastname": "TAUPE", "team": "Visma", "age": 22, "uciID": "1007896325", "ffcID": ""}
      ],
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "status": "ok",
      "entries": 3
    }
    ```
* **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Invalid format"
    }
    ```

### Examples

- Create a competition (use port 5000 for development or 80 for production): `curl -X POST http://localhost:5000/api/v1/competitions -H "Content-Type: application/json" -d '{"name":"Tour de France 2026"}'`
- Create a list of racers inside the created competition (competition id is returned at creation): `curl -X POST http://localhost:5000/api/v1/tour_de_france_2026/racers/sync -H "Content-Type: application/json" -d '{"racers": [{"id": 1, "name": "Tadej Pogačar", "team": "UAE Team Emirates"},{"id": 11, "name": "Jonas Vingegaard", "team": "Visma-Lease a Bike"},{"id": 21, "name": "Remco Evenepoel", "team": "Soudal Quick-Step"}] }'`
- Get all the data for a competition: `curl http://localhost:5000/api/v1/tour_de_france_2026/all`
- Configure the race: `curl -X POST http://localhost:5000/api/v1/tour_de_france_2026/race-info/sync -H "Content-Type: application/json" -d '{"config": {"name": "Tour de France 2026", "nStages": 21,"startDate": "2026-07-04", "endDate": "2026-07-26", "type": "Grand Tour" } }'`
- Send stage result: `curl -X POST http://localhost:5000/api/v1/tour_de_france_2026/rankings/sync -H "Content-Type: application/json" -d '{"stage_id": 1, "type": "stage", "data": [ {"bib": 101, "pos": 1, "time": "04:22:10", "bonus": 10}, {"bib": 103, "pos": 2, "time": "04:22:14", "bonus": 6},  {"bib": 102, "pos": 3, "time": "04:22:14", "bonus": 4}  ] }'`


