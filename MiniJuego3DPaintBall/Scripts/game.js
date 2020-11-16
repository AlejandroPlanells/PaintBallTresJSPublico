// ------------------------------------- //
// ------- VARIABLES GLOBALES ------------ //
// ------------------------------------- //

//Componentes de la escena
var renderer, scene, camera, pointLight, spotLight;

// Tamaño de la escena
var fieldWidth = 400, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// Variables de la pelota
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// Variables de los marcadores
var score1 = 0, score2 = 0;
// Puntos de victorias
var maxScore = 7;

// Dificultad (0 - fácil, 1 - chungo)
var difficulty = 0.1;

// ------------------------------------- //
// ------- FUNCIONES DEL JUEGO -------------- //
// ------------------------------------- //

function setup()
{
	// Mensaje primero en llegar a
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

	// Reseteamos los scores
	score1 = 0;
	score2 = 0;

	// Ejecutamos la escena
	createScene();

	//Ejecutamos todo
	draw();
}

function createScene()
{
	// Tamaño de la escena
	var WIDTH = 640,
	  HEIGHT = 360;

	// Atributos de la camara
	var VIEW_ANGLE = 50, //angulo
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1, //distancia
	  FAR = 10000;//distancia lejos

//guardamos en c el marco de la escena
	var c = document.getElementById("gameCanvas");

	// Creamos el render de WebGL y el de la camara
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

//Creamos la escena
	scene = new THREE.Scene();

	// Añadir la camara a la escena
	scene.add(camera);

	//Establecemos una posición a la camara
	// not doing this somehow messes up shadow rendering
	camera.position.z = 320;

	// Iniciamos el render
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	//Añadimos el render al elemento del DOM
	c.appendChild(renderer.domElement);

	// Creamos el table sobre le que se juega
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;

	// Creamos el material de la paleta 1
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// Creamos el material de la paleta 2
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		});
	// Creamos el material del campo
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x4BD121
		});
	// Creamos el material de la mesa
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x111111
		});
	// Creamos el material de los pilares
	var pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x534d0d
		});
	//Material del suelo
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x888888
		});


	// Creamos el plano de la superficie del jeugo
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);

	scene.add(plane);
	plane.receiveShadow = true;

	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,	// this creates the feel of a billiards table, with a lining
		planeHeight * 1.03,
		100,				// an arbitrary depth, the camera can't see much of it anyway
		planeQuality,
		planeQuality,
		1),

	  tableMaterial);
	table.position.z = -51;	// we sink the table into the ground by 50 units. The extra 1 is so the plane can be seen
	scene.add(table);
	table.receiveShadow = true;

	// // Variables de la esfera
	// valores más bajos de 'segmento' y 'anillo' aumentarán el rendimiento
	var radius = 5,
		segments = 6,
		rings = 6;

	// // Material de la esfera
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		});

	// Creamos una pelota con la geometria de la esfeera
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// // Añadimos la esfera a la escena
	scene.add(ball);

	ball.position.x = 0;
	ball.position.y = 0;
	// Ponemos la pelota sobre la mesa
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;

	// // Configuramos las variables de las paletas
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;

	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// // Añadimos la paleta a la escena
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;

	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);

	// //Añadimos la otra paleta
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;

	// Ponemos las paletas en sus respectivos sitios
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;

	// Fijasmos la posisicion de las paltas
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;

	// Añadimos las animaciones a los pilares izquierdos
	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

		  new THREE.CubeGeometry(
		  30,
		  30,
		  300,
		  1,
		  1,
		  1 ),

		  pillarMaterial);

		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = 230;
		backdrop.position.z = -30;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;
		scene.add(backdrop);
	}
  //Añadimos las animaciones a los pilares derechos
	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

		  new THREE.CubeGeometry(
		  30,
		  30,
		  300,
		  1,
		  1,
		  1 ),

		  pillarMaterial);

		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = -230;
		backdrop.position.z = -30;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;
		scene.add(backdrop);
	}

	// finalmente terminamos agregando un plano de tierra para mostrar todas las sombras
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry(
	  1000,
	  1000,
	  3,
	  1,
	  1,
	  1 ),

	  groundMaterial);
    // Colocamos el terreno en una posicion especifica para mostrar mejor las sombras
	ground.position.z = -132;
	ground.receiveShadow = true;
	scene.add(ground);

	// // Creamos el punto de luz
	pointLight =
	  new THREE.PointLight(0xF8D898);

	//Le damos una posicion
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// Lo añadimos a la escena
	scene.add(pointLight);

	// añadidmos un foco de luz para proyectar sombras
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

	renderer.shadowMapEnabled = true;
}

function draw()
{
	// Ejecutamos escena y camara en el render
	renderer.render(scene, camera);
	// Ponemos la ejecucuón en bucle
	requestAnimationFrame(draw);
//declaramos funciones que vamos a usar
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
}

function ballPhysics()
{
	// Si sale del lado izquierdo
	if (ball.position.x <= -fieldWidth/2)
	{
		// CPU scores
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();
	}

	// Si sale del lado derecho
	if (ball.position.x >= fieldWidth/2)
	{
		// Player scores
		score1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(1);
		matchScoreCheck();
	}

	// sale de arriba
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	// si sale de abajo
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}

	// Reseteamos posicion de la bola al acabar
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;

	// ajustamos la velocidad de la pelota
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

//Movimiento de la paleta de la cpu
function opponentPaddleMovement()
{
	// Lerp towards the ball on the y plane
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;

	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{
		paddle2.position.y += paddle2DirY;
	}
	// if the lerp value is too high, we have to limit speed to paddleSpeed
	else
	{
		// if paddle is lerping in +ve direction
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// if paddle is lerping in -ve direction
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
	// We lerp the scale back to 1
	// this is done because we stretch the paddle at some points
	// stretching is done when paddle touches side of table and when paddle hits ball
	// by doing this here, we ensure paddle always comes back to default size
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
}


// movimiento de la paleta del jugador
function playerPaddleMovement()
{
	// izquierda
	if (Key.isDown(Key.A))
	{
		// si no toca el alteral de la mesa
		// nos movemos
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		// si toca no nos movemos y estiramos para incicar que no se puede
		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}
	//derecha
	else if (Key.isDown(Key.D))
	{
		// si no toca el alteral de la mesa
		// nos movemos
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
	// si toca no nos movemos y estiramos para incicar que no se puede
		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}
	// no se mueve la paleta
	else
	{
		// paramos la paleta
		paddle1DirY = 0;
	}

	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
	paddle1.position.y += paddle1DirY;
}

// Manejamos la camara y la iluminación
function cameraPhysics()
{
	// Vamos moviendo las luces
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;

	//la movemos detrás del jugador
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);

	//rotamos hasta la zona de la cpu
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

//añadimos colisiones a las sombras
function paddlePhysics()
{
	// Logica de la paleta del jugador

//si la bola está alineada con la paleta1 en el plano x, solo verificamos (colisión unidireccional)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// si la bola está alineada con la paleta1 en el plano y
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// si viaja hacia el jugador
			if (ballDirX < 0)
			{
				// Estira la paleta para indicar un golpe
				paddle1.scale.y = 15;
				// cambiar la dirección del recorrido de la bola para crear un rebote
				ballDirX = -ballDirX;
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}

	// Logica de la paleta de la cpu


	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{

		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{

			if (ballDirX > 0)
			{

				paddle2.scale.y = 15;

				ballDirX = -ballDirX;

				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

//Funcion de fin del juego
function resetBall(loser)
{
	// colocamos la bola en el centro de la mesa
	ball.position.x = 0;
	ball.position.y = 0;
	//Saques despues de un punto
	// Si el jugador pierde el último punto, enviamos el balón a la oponente.
	if (loser == 1)
	{
		ballDirX = -1;
	}
	// si la pierde el oponente la mandamos al jugador
	else
	{
		ballDirX = 1;
	}

	// configurar la bola para que se mueva en el plano
	ballDirY = 1;
}

var bounceTime = 0;
// Comprueba si el jugador o el oponente ha alcanzado los 7 puntos.
function matchScoreCheck()
{
	// if player has 7 points
	if (score1 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		// rebota la paleta
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// bailecito
		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	// si el oponente tiene 7
	else if (score2 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "CPU wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		// rebota la paleta
		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
		// bailecito
		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}
