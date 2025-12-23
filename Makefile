
IMAGE=dufui
SOURCES=app

# Create the React project using Next.js framework (run it only once)
create:
	docker run --rm -v $(PWD):/app -w /app node:18-alpine npx create-react-app $(SOURCES)

# Install / Update the packages in sandbox running NPM INSTALL
install:
	docker run --rm -v $(PWD)/$(SOURCES):/app -w /app node:18-alpine npm install $(PACKAGE)

#
# Development environment
#
build-dev:
	docker build -t $(IMAGE)-dev --target development .

start-dev:
	docker run --name app-dev --rm -d -p 3000:3000 -p 5000:5000 -v "$(PWD)/frontend:/app/frontend" -v "$(PWD)/backend:/app/backend" -v "$(PWD)/data/db:/app/backend/db" -v /app/frontend/node_modules -v /app/backend/node_modules --env CHOKIDAR_USEPOLLING=true $(IMAGE)-dev

stop-dev:
	docker stop app-dev

# To run a specific test file, use:
# docker run --rm --name=ui-test -v $(PWD)/$(SOURCES):/app -e CI=true -w /app dufui-dev npm test -- <relative-path-to-test-file>
test:
	docker run --rm --name=ui-test -v $(PWD)/$(SOURCES):/app -e CI=true -w /app $(IMAGE)-dev npm test -- --watchAll=false

#
# Production environment
#
build-prod:
	docker build -t $(IMAGE) --target production .

start-prod: build-prod
	docker run --rm --name=ui-prod -p 80:80 -d $(IMAGE)

stop-prod:
	docker stop ui-prod
