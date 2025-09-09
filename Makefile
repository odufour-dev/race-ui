
IMAGE=dufui
SOURCES=app

create:
	docker run --rm -v $(PWD):/app -w /app node:18-alpine npx create-react-app $(SOURCES)

build-dev:
	docker build -t $(IMAGE)-dev --target development .

start-dev:
	docker run --rm --name=ui-dev -d -p 3000:3000 -v $(PWD)/$(SOURCES):/app -w /app $(IMAGE)-dev

stop-dev:
	docker stop ui-dev

build-prod:
	docker build -t $(IMAGE) --target production .

start-prod: build-prod
	docker run --rm --name=ui-prod -p 80:80 -d $(IMAGE)

stop-prod:
	docker stop ui-prod
