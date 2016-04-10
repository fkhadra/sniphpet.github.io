---
layout: post
title: Store your git credential
date: 2016-04-09
disqus_id: dis570aab59df524
permalink: store-git-credential
tags:
- vcs
- git 
---

Git allows you to use SSH or HTTP protocols for connecting to remotes. However
at work, there was a time where only HTTP was enabled. Every remote's connection
required you to type your credential.

This can become frustrating. Fortunately a dead simple solution exist ! All we need
is to set a git configuration value named **credential.helper**.


<div markdown="1" class="toc">
<ul><li class="toc-summary">Contents</li></ul>

* TOC
{:toc}
</div>

### Storing
-----------

To permanently store your credential type :
 
{% highlight bash %}
$ git config --global credential.helper store
{% endhighlight %}

By default, git credential are stored in a plain-text file. The default location is 
**~/.git-credentials**. You can define the location using the `--file`
 option as follow :
 
{% highlight bash %}
$ git config --global credential.helper 'store --file /path/to/my/file'
{% endhighlight %}  

#### ... using osxkeychain 

To store your credential using osxkeychain the solution is straightforward :
{% highlight bash %}
$ git config --global credential.helper osxkeychain
{% endhighlight %}  

#### ... using wincred

Same as above but using wincred this time : 

{% highlight bash %}
$ git config --global credential.helper wincred
{% endhighlight %}  

### Caching ( my favorite choice )
----------------------------------

To cache your credential :

{% highlight bash %}
$ git config --global credential.helper cache
{% endhighlight %}

The default timeout is set to 15 minutes. You can use the `--timeout` option to set the value you want :

{% highlight bash %}
$ git config --global credential.helper 'cache --timeout=86400' #time in second
{% endhighlight %}

 

 


