---
layout: post
title:  "Enhance your dev stack with nginx dynamic vhost"
date:   2016-04-02 19:54:48 +0000
permalink: Enhance-your-dev-stack-with-nginx-dynamic-vhost
disqus_id: dis570030ebc7fb5
tags:
- Nginx
- Php
- Virtual Host
- vhost
- server
---


When an application involve a server, a virtual host is used to map the app folder to a domain name.
While the number of apps you have to manage is growing, you need more and more vhost to handle them.
Creating vhost is boring and repetitive even if you made a script to do it.
Time is precious, right ?

So, what we need is a single vhost that can handle all request and dispatch them to the correct app.
It must also handle new app without the need to reload the service.

<div markdown="1" class="toc">
<ul><li class="toc-summary">Contents</li></ul>

* TOC
{:toc}
</div>



<i>Note : If you don't care about the details jump to the end</i>

## Usual vhost
---------------

An usual vhost for php looks like as follow :

```bash
    server {
        listen      80;
        server_name foo.com;
        root        /var/www/foo/public;  

        location / {
            index   index.html index.php;
        }

        location ~* \.(gif|jpg|png)$ {
            expires 30d;
        }

        location ~ \.php$ {
            fastcgi_pass  localhost:9000;
            fastcgi_param SCRIPT_FILENAME
                          $document_root$fastcgi_script_name;
            include       fastcgi_params;
        }
    }
```

Let's pay attention to the server_name and the root directives. Now imagine that we have to handle bar.com too.
To do so we need a new vhost with the corresponding server_name and root directives. And so on for others applications, you get the idea.

Nginx allows to define a server_name directive using regular expression. The regular expressions used by Nginx are the
same used by Perl ([PCRE](http://www.pcre.org/)).

## Building the regular expression
-----------------------------------

We want access to bar.com through www.bar.com or bar.com. Let's split the url in 3 parts :

 <div class="sub-header">1. Matching the subdomain</div>

```bash
 ^(www\.)?
```


- "^" assert capturing group at start of the string
- parentheses to define a capturing group
- "www." to match literally
- "?" capturing group can be matched 0 or 1 time

 <div class="sub-header">2. Matching the domain name</div>

```bash
(?<domain>.+)
```
- "?" define the start of the named capturing group
- &lt;domain&gt; is the named capturing group name. Name it whatever you like
- "." to match any character except new line
- "+" to match the previous token between one and unlimited times

 <div class="sub-header">3. Matching the top level domain</div>


I'm lazy so I always use .lh(localhost) as TLD.

 <div class="sub-header">4. All together</div>

```bash
^(www\.)?(?<domain>.+).lh
```

It's not done yet.

To use a regular expression with Nginx, we must start with the tilde character otherwise it will be treated literally.

```bash
server {
    ***
    server_name  ~^(www\.)?(?<domain>.+).lh;
    ***
}
```

## Mapping the root directory
------------------------------

Simply use the named capturing group as follow :

```bash
server {
     ***
      root   /var/www/$domain/public;
     ***
}
```

## A word about logs
---------------------

We can use variable with access_log directive but this is not the case for the error_log directive.

When I need logs during development, I'm doing as follow :

```bash
 access_log            /var/log/nginx/$domain.access.log main;
 error_log             /var/log/nginx/wildcard.error.log;
```

## One vhost to rule them all, One vhost to find them...
---------------------------------------------------------

Below, the vhost I use when developing php applications. I can access foo.lh, www.bar.lh and what-ever.lh using a single vhost file.
If you create a new project under /var/www you don't need to reload nginx service.

The only drawback regarding this approach is that the domain name (excluding the TLD) must be the same as the one used
for the application folder name.

```bash
   server {
           listen                80;

           server_name           ~^(www\.)?(?<domain>.+).lh$;
           client_max_body_size 1000m;

           root /var/www/$domain/public; #Most of the time if not always my index file
                                         #is located inside the public folder
           index  index.php;

           access_log            /var/log/nginx/$domain.access.log main;
           error_log             /var/log/nginx/wildcard.error.log;

          location ~ \.php$ {

              fastcgi_index index.php;
              fastcgi_split_path_info ^(.+\.php)(/.*)$;
              try_files $uri $uri/ /index.php$is_args$args;
              include /etc/nginx/fastcgi_params;
              fastcgi_pass 127.0.0.1:9000;

              fastcgi_param SCRIPT_FILENAME $request_filename;
              fastcgi_param APPLICATION_ENV development;

              fastcgi_buffers 8 16k;
              fastcgi_buffer_size 32k;
              fastcgi_connect_timeout 300;
              fastcgi_send_timeout 300;
              fastcgi_read_timeout 300;

          }
          location / {

              try_files $uri $uri/ /index.php$is_args$args;
              autoindex on;
              index  index.php;


          }
          sendfile off;
      }
```

If you are using vagrant with Windows host don't forget to update your host file or use a tool to forward DNS requests.
For *nix user I suggest you to use [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) to forward all requests.
