---
publishDate: '2023-01-25T23:10:00.000Z'
title: Kubernetes in a Nutshell
description: >-
  A very simple way of looking at Kubernetes, mainly written to get rid of the fear around this tool
tags: ['technical']
pubDate: 'Jul 02 2022'
heroImage: '../../assets/images/te.jpg'
category: 'Tech'
---

Kubernetes is a container orchestration software. The containers here can be Docker containers. Docker itself is a revolution, it helped us package our apps in containers that had everything the app needed already configured, containers are like really really lightweight virtual machines with an efficient way of using the Host OS.

Resource I learned from: Hitesh Chaudhary's YouTube video, I watched a few others but his one was simple and practical.

Kubernetes(K8S) is used because it ensures these things:

1. Automatic horizontal scaling across clusters.
2. Provisioning and deprovisioning of pods\* and clusters according to load.

Pods in Kubernetes are the smallest unit of deployment, but they are not where the deployed application runs. Pods are the smallest unit of scheduling in Kubernetes, they can contain one or more containers, and they share the same network namespace and storage.

3. Load balancing between pods.

Just using Docker gives us the benefits of containers, K8S helps us manage many of these containers to fulfill our needs.

Kubernetes runs as a cluster, these clusters each have a control plane, which can be used from a GUI or CLI, that manages the underlying pods.

The control plane is the set of components that control the state of the Kubernetes cluster, it includes components like the API server, etcd, and kube-scheduler.
