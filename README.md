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

### Examples

- Create a competition (use port 5000 for development or 80 for production): `curl -X POST http://localhost:5000/api/v1/competitions -H "Content-Type: application/json" -d '{"name":"Tour de France 2026"}'`
- Create a list of racers inside the created competition (competition id is returned at creation): `curl -X POST http://localhost:5000/api/v1/tour_de_france_2026/racers/sync -H "Content-Type: application/json" -d '{"racers": [{"id": 1, "name": "Tadej Pogačar", "team": "UAE Team Emirates"},{"id": 11, "name": "Jonas Vingegaard", "team": "Visma-Lease a Bike"},{"id": 21, "name": "Remco Evenepoel", "team": "Soudal Quick-Step"}] }'`
- Get all the data for a competition: `curl http://localhost:5000/api/v1/tour_de_france_2026/all`
- Configure the race: `curl -X POST http://localhost:5000/api/v1/tour_de_france_2026/race-info/sync -H "Content-Type: application/json" -d '{"config": {"name": "Tour de France 2026", "nStages": 21,"startDate": "2026-07-04", "endDate": "2026-07-26", "type": "Grand Tour" } }'`
- Send stage result: `curl -X POST http://localhost:5000/api/v1/tour_de_france_2026/rankings/sync -H "Content-Type: application/json" -d '{"stage_id": 1, "type": "stage", "data": [ {"bib": 101, "pos": 1, "time": "04:22:10", "bonus": 10}, {"bib": 103, "pos": 2, "time": "04:22:14", "bonus": 6},  {"bib": 102, "pos": 3, "time": "04:22:14", "bonus": 4}  ] }'`


