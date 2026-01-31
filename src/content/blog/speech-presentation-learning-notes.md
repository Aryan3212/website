---
pubDate: '2026-01-31T12:00:00.000Z'
title: 'What I’m Working On: Speech Presentation Learning (Early Research Notes)'
description: 'A high-level snapshot of my current independent research direction in speech representation learning.'
tags: ['research', 'audio', 'speech', 'representation-learning']
heroImage: '../../assets/images/te.jpg'
category: 'Research'
---

This post summarizes my current independent research direction in **speech representation learning**. It is intentionally high-level and focuses on the research question, modeling choices, and evaluation plan rather than results.

## TL;DR

- I am exploring **continuous-latent autoencoder** training for speech representations, with joint objectives for semantic structure and reconstruction.
- The goal is to **improve strong baselines** that already unify representation learning and generation (e.g., UniWav), targeting both performance and resource efficiency. [3]
- A core hypothesis is that **geometric regularization** can substitute for KL-style regularization in an autoencoder-style framework, improving stability and downstream discriminability.

## Research direction

The current landscape includes self-supervised representation learners such as wav2vec 2.0 and HuBERT, as well as more recent SSL frameworks optimized for speed and scalability. [2][10][9] There is also increasing work on general-purpose audio encoders (e.g., OpenBEATs) and unified SSL frameworks for speech/audio. [7][6]

There are also “fast Conformer” lines of work that position efficient encoders as broadly useful building blocks across speech tasks (e.g., NEST). [15][12][4]

Separately, neural audio codecs have shown that high-fidelity reconstruction is achievable with compact representations (e.g., EnCodec), and foundation models such as Moshi build on this class of ideas for speech-text interaction. [11][8]

Continuous audio language modeling is another relevant direction here: CALM formalizes continuous representations for generative modeling, and it is useful as a reference point for thinking about continuous-latent objectives and codec-like bottlenecks in modern speech systems. [16][11][8]

Recent work has also shown that it is possible to unify representation learning and generation within a single model (e.g., UniWav). [3] My focus is not the existence of this unification, but whether an **autoencoder-centric formulation** can improve the baseline—particularly under compute and data constraints, and in lower-resource settings.

Concretely, I am testing a **continuous latent autoencoder** approach that aims to:

- improve semantic discriminability while retaining reconstruction fidelity,
- remain **resource-efficient** in lower-resource settings (including experiments targeting Bengali speech),
- provide a more stable regularization strategy than standard VAE-style KL divergence (see hypothesis below).

## Proposed approach

The working design includes:

- an encoder backbone inspired by Zipformer (with modifications for efficiency), [1]
- architectural mechanisms to preserve information flow through the bottleneck (to support reconstruction),
- a semantic objective to shape latent-space geometry,
- a reconstruction objective (and, potentially, adversarial components) to maintain perceptual quality.

## Key hypothesis (SigReg vs. KL)

One of the hypotheses I am actively testing is that **geometric regularization** can serve as a more effective constraint for continuous latents than a conventional **KL divergence** term, particularly when the model is trained in an autoencoder-style framework.

This direction is motivated by recent work arguing that unified autoencoding can reconcile semantic and low-level representations (the “Prism Hypothesis”), which aligns with the intuition that reconstruction and semantics can be modeled within a single framework rather than treated as competing objectives. [5]

I am also using representation-autoencoder-style ideas as implementation guidance around training dynamics and latent usage. [14]

## Evaluation (ongoing)

I am benchmarking against strong existing systems (including UniWav, wav2vec 2.0, HuBERT, and other recent SSL frameworks) and tracking both: [3][2][10][9][6]

- reconstruction-oriented metrics (e.g., spectral distances; perceptual scores when appropriate),
- downstream discrimination tasks that reflect semantic usefulness,
- resource sensitivity (training stability, data efficiency, and compute requirements), with a focus on lower-resource settings such as Bengali.

<!-- PORTFOLIO_PROOF: link a public reading list / notes repo when ready -->
<!-- PORTFOLIO_DEMO: short Loom walking through the model + eval pipeline (when it exists) -->

## References

[1] Z. Yao et al., “Zipformer: A faster and better encoder for automatic speech recognition,” 2023, doi: 10.48550/ARXIV.2310.11230.

[2] A. Baevski, H. Zhou, A. Mohamed, and M. Auli, “wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations,” Oct. 22, 2020, arXiv: arXiv:2006.11477. doi: 10.48550/arXiv.2006.11477.

[3] A. H. Liu et al., “UniWav: Towards Unified Pre-training for Speech Representation Learning and Generation,” Mar. 02, 2025, arXiv: arXiv:2503.00733. doi: 10.48550/arXiv.2503.00733.

[4] Y. Yang, F. Yao, M. Liao, and Y. Huang, “Ubranch Conformer: Integrating Up-Down Sampling and Branch Attention for Speech Recognition,” IEEE Access, vol. 12, pp. 144684–144697, 2024, doi: 10.1109/ACCESS.2024.3471183.

[5] W. Fan, H. Diao, Q. Wang, D. Lin, and Z. Liu, “The Prism Hypothesis: Harmonizing Semantic and Pixel Representations via Unified Autoencoding,” Dec. 22, 2025, arXiv: arXiv:2512.19693. doi: 10.48550/arXiv.2512.19693.

[6] X. Yang et al., “SPEAR: A Unified SSL Framework for Learning Speech and Audio Representations,” Oct. 29, 2025, arXiv: arXiv:2510.25955. doi: 10.48550/arXiv.2510.25955.

[7] S. Bharadwaj et al., “OpenBEATs: A Fully Open-Source General-Purpose Audio Encoder,” Jul. 18, 2025, arXiv: arXiv:2507.14129. doi: 10.48550/arXiv.2507.14129.

[8] A. Défossez et al., “Moshi: a speech-text foundation model for real-time dialogue,” Oct. 02, 2024, arXiv: arXiv:2410.00037. doi: 10.48550/arXiv.2410.00037.

[9] Y. Yang et al., “k2SSL: A Faster and Better Framework for Self-Supervised Speech Representation Learning,” Nov. 26, 2024, arXiv: arXiv:2411.17100. doi: 10.48550/arXiv.2411.17100.

[10] W.-N. Hsu, B. Bolte, Y.-H. H. Tsai, K. Lakhotia, R. Salakhutdinov, and A. Mohamed, “HuBERT: Self-Supervised Speech Representation Learning by Masked Prediction of Hidden Units,” Jun. 14, 2021, arXiv: arXiv:2106.07447. doi: 10.48550/arXiv.2106.07447.

[11] A. Défossez et al., “High Fidelity Neural Audio Compression,” Oct. 24, 2022, arXiv: arXiv:2210.13438. doi: 10.48550/arXiv.2210.13438.

[12] D. Rekesh et al., “Fast Conformer with Linearly Scalable Attention for Efficient Speech Recognition,” Sep. 30, 2023, arXiv: arXiv:2305.05084. doi: 10.48550/arXiv.2305.05084.

[13] Z. Ma et al., “emotion2vec: Self-Supervised Pre-Training for Speech Emotion Representation,” Dec. 23, 2023, arXiv: arXiv:2312.15185. doi: 10.48550/arXiv.2312.15185.

[14] B. Zheng, N. Ma, S. Tong, and S. Xie, “Diffusion Transformers with Representation Autoencoders,” Oct. 13, 2025, arXiv: arXiv:2510.11690. doi: 10.48550/arXiv.2510.11690.

[15] H. Huang et al., “NEST: Self-supervised Fast Conformer as All-purpose Seasoning to Speech Processing Tasks,” Aug. 23, 2024, arXiv: arXiv:2408.13106. doi: 10.48550/arXiv.2408.13106.

[16] S. Rouard, M. Orsini, A. Roebel, N. Zeghidour, and A. Défossez, “Continuous Audio Language Models,” Sep. 09, 2025, arXiv: arXiv:2509.06926. doi: 10.48550/arXiv.2509.06926.
