let interval;

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateNormalData() {
    return {
        retry: random(1, 5),
        status: 200,
        cpu: random(30, 60),
        memory: random(40, 70),
        response: random(100, 300),
        rate: random(10, 30),
        traffic: random(100, 400),
        login: random(1, 3),
        admin: random(0, 1)
    };
}

function generateAttackData() {
    let type = random(1, 5);

    if (type === 1) {
        return { retry: 30, status: 401, rate: 50 };
    }
    if (type === 2) {
        return { cpu: 95, response: 1000, rate: 200 };
    }
    if (type === 3) {
        return { status: 500, cpu: 80 };
    }
    if (type === 4) {
        return { traffic: 2000, response: 100 };
    }
    return { login: 20, admin: 10 };
}

function classify(row) {
    let score = 0;
    let type = "Normal";

    if (row.retry > 15 && row.status === 401) {
        type = "Brute Force";
        score += 3;
    }
    else if (row.cpu > 85 && row.response > 800) {
        type = "DDoS";
        score += 4;
    }
    else if (row.status >= 500) {
        type = "Server Failure";
        score += 2;
    }
    else if (row.traffic > 1000) {
        type = "Data Exfiltration";
        score += 3;
    }
    else if (row.login > 10 && row.admin > 5) {
        type = "Privilege Escalation";
        score += 4;
    }

    return { type, score };
}

function updateUI(data, result) {
    document.getElementById("cpu").innerText = data.cpu || 0;
    document.getElementById("memory").innerText = data.memory || 0;
    document.getElementById("traffic").innerText = data.traffic || 0;
    document.getElementById("response").innerText = data.response || 0;

    document.getElementById("attack").innerText = result.type;
    document.getElementById("severity").innerText = result.score;
}

function logEvent(text) {
    let box = document.getElementById("logBox");
    box.innerHTML += `<p>> ${text}</p>`;
    box.scrollTop = box.scrollHeight;
}

function startSimulation() {
    interval = setInterval(() => {
        let data = generateNormalData();
        let result = classify(data);

        updateUI(data, result);
        logEvent("Normal activity");
    }, 1000);
}

function stopSimulation() {
    clearInterval(interval);
}

function injectAttack() {
    let data = generateNormalData();
    let attack = generateAttackData();

    Object.assign(data, attack);

    let result = classify(data);

    updateUI(data, result);
    logEvent("⚠ Attack Detected: " + result.type);
}