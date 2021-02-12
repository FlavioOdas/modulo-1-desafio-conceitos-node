const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {
        body: { title, url, techs },
    } = request;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const {
        params: { id },
        body: { title, url, techs },
    } = request;

    const repositoryIndex = repositories.findIndex(
        (repository) => id === repository.id
    );

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "Repository not found" });
    }

    repositories[repositoryIndex] = {
        ...repositories[repositoryIndex],
        title,
        url,
        techs,
    };

    return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
    const {
        params: { id },
    } = request;

    const repositoryIndex = repositories.findIndex(
        (repository) => id === repository.id
    );

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "Repository not found" });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const {
        params: { id },
    } = request;

    const repositoryIndex = repositories.findIndex(
        (repository) => id === repository.id
    );

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "Repository not found" });
    }

    repositories[repositoryIndex] = {
        ...repositories[repositoryIndex],
        likes: repositories[repositoryIndex].likes + 1,
    };

    return response.json(repositories[repositoryIndex]);
});

module.exports = app;
