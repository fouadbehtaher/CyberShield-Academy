# CyberShield-Academy
A specialized academy providing hands-on, real-world cybersecurity training through a Cyber Range and simulations. Its mission is to quickly qualify professionals in essential skills like ethical hacking and incident response to meet the global demand for cyber defenders.

## Gateway routes

How `CyberShield-Platform/api-gateway` routes requests, from its `application.yml`. The diagram shows routing only, not that each service is complete or running.

![CyberShield API gateway routes](docs/images/cybershield-gateway-routes.png)

## Build status

What was run (Node 20, local, not hosted CI):

| Part | Result |
| --- | --- |
| `admin-dashboard` | `npm install` and `npm run build` succeed (React, Vite, MUI). |
| `frontend` | `npm run typecheck` reports 0 errors. `npm run build` succeeds (needs about 2 GB of RAM; the heap limit is set in the script) and mounts the existing control panel and the 3D cyber city view from `src/main.tsx`. `three` was raised to ^0.167 (the version the typings already target) because the old one broke the build. |
| `backend` | Not runnable. It holds a user model, two services and two engine files, with no server entry, routes or Dockerfile. |
| `CyberShield-Platform` | `analytics-service` (Java 17, Spring Boot 3.2.5) now has a `pom.xml`: `mvn package` builds the jar, 9 unit tests pass, and the jar starts and answers `GET /api/analytics/user/{id}` with an empty snapshot (checked locally with no Kafka or Eureka running; nothing was sent to Kafka). Its Scala files (`src/main/scala`) are not part of that build: they need Akka, Flink and spray-json dependencies that nobody declared, and `AdvancedAnalytics.scala` starts with Java-style imports, so it would not compile as written. The other 9 service folders still have no `pom.xml` or Gradle files, so nothing builds there. |
| `docker-compose.yml` | Only `frontend` has a Dockerfile (added, not run in Docker). The other services still lack one, so the full stack does not start. |

The frontend calls `/api/*` endpoints that this repository does not implement, so its data panels stay empty until a backend exists.
