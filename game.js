var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 1535;
c.height = 725;
document.body.appendChild(c);

var perm = [];
while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
var noise = x => {
    x = x * 0.01 % 254;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var Player = function () {
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
    this.img = new Image();
    this.img.src = document.getElementsByTagName("template")[0]?.innerHTML || '';
    this.draw = function () {
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;

        var grounded = 0;
        if (p1 - 24 > this.y) { // Adjusted for the increased size
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1 - 24); // Adjusted for the increased size
            this.y = p1 - 24; // Adjusted for the increased size
            grounded = 1;
        }

        var angle = Math.atan2((p2 - 24) - this.y, (this.x + 5) - this.x);
        this.y += this.ySpeed;

        if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
            playing = false;
            this.rSpeed = 5;
            this.x -= speed * 5;
        }

        if (grounded && playing) {
            this.rot -= (this.rot - angle) * 0.65;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }
        this.rSpeed += rotationInput * 0.05; // Use fetched rotation input
        this.rot -= this.rSpeed * 0.1;
        if (this.rot > Math.PI) this.rot = -Math.PI;
        if (this.rot < -Math.PI) this.rot = Math.PI;
        ctx.save();
        ctx.translate(this.x, this.y - 6); // Adjusted translation to lift the player slightly
        ctx.rotate(this.rot);

        // Increased size
        ctx.drawImage(this.img, -30,-30,60,60); // Adjusted size to 60x60

        ctx.restore();
    }
}

var player = new Player();
var t = 0;
var speed = 0;
var playing = true;
var powerInput = 0; // Represents 'Power' value fetched from S3
var rotationInput = 0; // Placeholder for rotation logic, if required.

var distance = 0; // Variable to track the distance
var caloriesBurnt = 0; // Variable to track the calories burnt

function fetchLatestData() {
    fetch('https://wattifys3.s3.us-east-1.amazonaws.com/latest.json')
        .then(response => response.json())
        .then(data => {
            powerInput = data.Power || 0;
            let timestamp = new Date(data.Timestamp).toLocaleString();
            document.getElementById('data').innerHTML = `
                <strong>Power:</strong> ${powerInput}<br>
                <strong>Timestamp:</strong> ${timestamp}<br>
                <strong>Distance:</strong> ${distance.toFixed(2)} m<br>
                <strong>Calories Burnt:</strong> ${caloriesBurnt.toFixed(2)} kcal
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('data').innerText = 'Error fetching data';
        });
}


function loop() {
    speed -= (speed - powerInput) * 0.0001; // 'Power' controls acceleration/deceleration
    t += 10 * speed;

    // Update distance and calories
    distance += speed * 0.1; // Increase distance based on speed
    caloriesBurnt = distance * 0.05; // Approximate calories burnt based on distance

    ctx.fillStyle = "#19f";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
        ctx.lineTo(i, c.height * 0.8 - noise(t + i * 5) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    ctx.fillStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    player.draw();
    if (player.x < 0) restart();
    requestAnimationFrame(loop);
}

function restart() {
    player = new Player();
    t = 0;
    speed = 0;
    playing = true;
    distance = 0; // Reset distance
    caloriesBurnt = 0; // Reset calories burnt
}

// Fetch data from S3 every second
setInterval(fetchLatestData, 1000);

loop();


