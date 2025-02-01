<?php
$environment = "production";

if ($environment === "production") {
    define("URL", "https://portdoverservicecentre.com/");
    define("ACCESS_TOKEN", "EAAAllQGZo1FO_kXAMHvXvddeteEdMzqnIXD3jfPbRLG3D8XqJhosYHG04HlsO6a");
    define("SEVERNAME", "md-auto.cjimysgq8lhp.us-east-2.rds.amazonaws.com");
    define("USERNAME", "admin");
    define("PASSWORD", "CScs123456!");
    define("DBNAME", "md_auto");
} else {
    define("URL", "https://localhost/md-auto/");
    define("ACCESS_TOKEN", "EAAAlyWFexO1fcGLwQjO79TXF4ydUy0OEJZQNP9IS5Hcct9Fq_5RqG6lrSQy4-Q8");
    define("SEVERNAME", "localhost");
    define("USERNAME", "root");
    define("PASSWORD", "");
    define("DBNAME", "md_auto");
}

define("ENVIRONMENT", $environment);
