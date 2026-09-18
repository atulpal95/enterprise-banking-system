package com.atul.banking.util;

public class EmailTemplateBuilder {

    public static String buildEmail(String title,
                                    String customerName,
                                    String bodyContent) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body{
                            margin:0;
                            padding:0;
                            background:#f4f6f9;
                            font-family:Arial,Helvetica,sans-serif;
                        }

                        .container{
                            width:650px;
                            margin:30px auto;
                            background:#ffffff;
                            border-radius:12px;
                            overflow:hidden;
                            box-shadow:0 2px 10px rgba(0,0,0,.15);
                        }

                        .header{
                            background:#0d6efd;
                            color:white;
                            text-align:center;
                            padding:25px;
                        }

                        .header h1{
                            margin:0;
                        }

                        .content{
                            padding:30px;
                            color:#333;
                            line-height:1.8;
                            font-size:15px;
                        }

                        .card{
                            background:#f8f9fa;
                            border-left:5px solid #0d6efd;
                            padding:18px;
                            margin:20px 0;
                            border-radius:6px;
                        }

                        .security{
                            background:#fff8e1;
                            border-left:5px solid orange;
                            padding:15px;
                            margin-top:25px;
                        }

                        .footer{
                            background:#212529;
                            color:#ffffff;
                            text-align:center;
                            padding:20px;
                            font-size:13px;
                        }

                        .footer a{
                            color:#0dcaf0;
                            text-decoration:none;
                        }

                    </style>
                </head>

                <body>

                <div class="container">

                    <div class="header">
                        <h1>🏦 Enterprise Banking System</h1>
                        <p>Secure • Fast • Trusted</p>
                    </div>

                    <div class="content">

                        <h2>%s</h2>

                        <p>
                        Dear <b>%s</b>,
                        </p>

                        <div class="card">
                        %s
                        </div>

                        <div class="security">

                        <b>Security Advice</b>

                        <br><br>

                        Never share your password, OTP,
                        debit card PIN or internet banking
                        credentials with anyone.

                        </div>

                    </div>

                    <div class="footer">

                        © 2026 Enterprise Banking System

                        <br><br>

                        This is an automated email.
                        Please do not reply.

                    </div>

                </div>

                </body>
                </html>
                """.formatted(title,
                customerName,
                bodyContent);
    }
}