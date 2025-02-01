<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        :root {
            --black: #000000;
            --red: #ff0000;
            --blue: #0d2984;
            --blue-hover: #1237af;
            --yellow: #f6ac0e;
            --yellow-hover: #d2930b;
            --white: #ffffff;
        }

        body,
        html,
        #root {
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 0;
            display: flex;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
                "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        #root {
            max-width: 1920px;
        }

        .navbar {
            background-color: var(--blue);
            padding: 10px 30px !important;
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .nav-images-container {
            display: flex;
        }

        .nav-logo,
        .nav-service-center,
        .nav-napa-logo {
            width: auto;
            height: 70px;
        }

        .nav-location-link {
            width: 70px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .nav-location {
            width: 60px;
            height: 60px;
            fill: var(--yellow);
        }

        .nav-address {
            width: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .nav-address a {
            color: var(--yellow);
            font-size: 16pt;
            text-decoration: none;
        }

        .nav-book-app {
            width: auto;
            display: flex;
            align-items: center;
            text-align: center;
        }

        .nav-book-app a {
            color: var(--yellow);
            font-size: 16pt;
            text-decoration: none;
        }

        .nav-cart-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>

<body>

    <nav class='navbar'>
        <div class='nav-images-container'>
            <img class="nav-logo" src="https://portdoverservicecentre.com/assets/images/md-auto-logo.png" alt="Logo" />
            <img class="nav-service-center" src="https://portdoverservicecentre.com/assets/images/service-center-logo.png" alt="Service Center" />
            <img class="nav-napa-logo" src="https://portdoverservicecentre.com/assets/images/napa-logo.png" alt="NAPA Logo" />
            <div class='nav-location-link'>
                <a href="https://www.google.com/maps/place/119+St+Andrew+St,+Port+Dover,+ON+N0A+1N0/data=!4m2!3m1!1s0x882c53716bd60e17:0xd4dc6e7192d5b30d?sa=X&ved=1t:242&ictx=111">
                    <IoLocationSharp class="nav-location" />
                </a>
            </div>
        </div>
        <div class='nav-address'>
            <a href="https://www.google.com/maps/place/119+St+Andrew+St,+Port+Dover,+ON+N0A+1N0/data=!4m2!3m1!1s0x882c53716bd60e17:0xd4dc6e7192d5b30d?sa=X&ved=1t:242&ictx=111">119 St. Andrews St.</a>
            <a href="tel:519-583-0996">519-583-0996</a>
        </div>

        <div class='nav-book-app'>
            <a href="https://portdoverservicecentre.mechanicnet.com/apps/shops/display?page=appointment">
                Book <br />
                Appointment
            </a>
        </div>
    </nav>

    <section>
        <?php
        echo $content;
        ?>
    </section>

    <center style="margin-top: 30px;">
        <a href="https://portdoverservicecentre.com/api/remove-subscriber.php?id=<?php echo $id ?>">Unsubscribe</a>
    </center>

</body>

</html>