## Architecture

The architecture of the Griote Foundation is designed to be modular and scalable. The system is divided into several services, each responsible for a specific domain of functionality. The services are built using Node.js and communicate with each other using REST APIs.

The services are:

* **User Service**: Responsible for user authentication and authorization
* **Depot Service**: Responsible for storing and retrieving documents
* **Project Service**: Responsible for managing projects and their associated documents
* **Mail Service**: Responsible for sending emails
* **Events Service**: Responsible for publishing and subscribing to events

The services communicate with each other using REST APIs. The APIs are documented using OpenAPI and can be accessed at `<http://localhost:3000/api/docs>`.

The system uses a PostgreSQL database for storing data. The database is divided into several schemas, each corresponding schema is associated with a specific service.

The system uses RabbitMQ for event publishing and subscribing. Events are published to specific queues and can be consumed by any service that is subscribed to the queue.

The system uses a load balancer to distribute incoming requests across multiple instances of the services. The load balancer is configured to use a round-robin algorithm to distribute the requests.

The system uses a reverse proxy to provide a single entry point for all the services. The reverse proxy is configured to route requests to the appropriate service based on the URL path.

The system uses a monitoring system to monitor the performance of the services. The monitoring system is configured to send alerts to the development team when the performance of the services falls below a certain threshold.

The system uses a logging system to log important events. The logging system is configured to log events to a central log server.

The system uses a caching system to cache frequently accessed data. The caching system is configured to use a distributed cache that is shared across all the services.
