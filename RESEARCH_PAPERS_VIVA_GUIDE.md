# 📚 Research Papers Master Guide — Viva Preparation

Yeh guide aapke **Synopsis Report (Page 10, References)** aur **PPT Slides (Slide 5 & 11)** mein cited **5 Main Research Papers** ki complete summary, core concepts aur expected viva questions cover karti hai.

---

## 📑 Quick Reference Table

| Paper # | Research Paper Title | Authors & Year | Core Focus | Project Relevance |
| :--- | :--- | :--- | :--- | :--- |
| **Paper 1** | **Isolation Forest** | F. T. Liu, K. M. Ting, Z. H. Zhou (IEEE ICDM 2008) | Unsupervised anomaly isolation via binary tree path lengths | **Layer 1 ML Algorithm** |
| **Paper 2** | **UNSW-NB15 Benchmark Dataset** | N. Moustafa, J. Slay (IEEE MilCIS 2015) | Realistic modern network intrusion flow data | **Network Flow Features & Attack Baseline** |
| **Paper 3** | **ML-Based Phishing Detection from URLs** | O. K. Sahingoz, E. Buber, et al. (Elsevier 2019) | Lexical token & NLP URL parsing for phishing | **Layer 2 URL Safety Classifier** |
| **Paper 4** | **Diagnosing Network-Wide Traffic Anomalies** | A. Lakhina, M. Crovella, C. Diot (ACM SIGCOMM 2004) | Statistical flow metrics & volume anomaly subspace | **Flow duration, byte rate & burst metrics** |
| **Paper 5** | **Systematic Intrusion Datasets (ISCX)** | A. Shiravi, H. Shiravi, A. A. Ghorbani (2012) | Systematic profiling of multi-stage attacks | **Brute-force, DoS & Exfiltration patterns** |

---

# 📖 Paper 1: Isolation Forest (Liu et al., IEEE ICDM 2008)
> **Full Title:** *Isolation Forest*  
> **Authors:** Fei Tony Liu, Kai Ming Ting, Zhi-Hua Zhou (Eighth IEEE International Conference on Data Mining)

### 🎯 Main Idea & Contribution:
* Traditional anomaly detection algorithms (like ORCA, LOF, 1-Class SVM) try to build a model of **normal points** (dense clusters) and identify outliers as points that don't fit the cluster.
* **Liu et al. proposed a paradigm shift:** Instead of profiling normal instances, **directly isolate anomalous instances**.
* **Why it works:** Anomalies have two fundamental properties:
  1. They are **few in number** (minority).
  2. They have **attribute values very different** from normal instances.
* Because of this, when randomly splitting data space with binary decision trees (**iTrees**), anomalies are isolated **very close to the root (short tree path length h(x))**, whereas normal instances need many splits deep down the tree.

### 📐 Mathematical Formulation:
* **Anomaly Score Equation:**
  $$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$
* **Average Path Length of Unsuccessful Search in BST ($c(n)$):**
  $$c(n) = 2\ln(n - 1) + 0.5772156649 - \frac{2(n - 1)}{n}$$
* If $s \to 1$: Highly anomalous (Definite Threat).
* If $s < 0.5$: Normal operational instance.

### ❓ Questions Examiner Will Ask from Paper 1:
* **Q1.1: Why does Isolation Forest have linear time complexity?**
  * **Ans:** Because it builds trees using small sub-samples (psi = 256) rather than the entire dataset. Training complexity is O(t * psi * log psi) and evaluation is O(t * log psi), where t is the number of trees (150).
* **Q1.2: What is "Masking" and "Swamping" in anomaly detection, and how does Isolation Forest solve them?**
  * **Ans:** *Swamping* is falsely classifying normal instances as anomalies. *Masking* is when too many anomalies cluster together, hiding each other. Isolation Forest solves both by using **sub-sampling (psi = 256)**, which isolates small subsets where swamping and masking cannot occur.

---

# 📖 Paper 2: UNSW-NB15 Dataset (Moustafa & Slay, 2015)
> **Full Title:** *UNSW-NB15: A Comprehensive Data Set for Network Intrusion Detection Systems*  
> **Authors:** Nour Moustafa and Jill Slay (Australian Cyber Security Centre / IEEE MilCIS)

### 🎯 Main Idea & Contribution:
* Older intrusion datasets like **KDD99** and **NSL-KDD** were generated in 1998/1999 and lacked modern low-footprint attack vectors (like sophisticated exfiltration, backdoors, modern DoS).
* Moustafa & Slay created the **UNSW-NB15** dataset using the IXIA PerfectStorm tool to simulate realistic hybrid normal modern traffic alongside 9 distinct attack categories.
* It introduced **49 flow features** covering packet duration, inter-arrival time (jitter), byte ratios, service flags, and connection states.

### ❓ Questions Examiner Will Ask from Paper 2:
* **Q2.1: Why not use KDD99 dataset? Why UNSW-NB15?**
  * **Ans:** KDD99 is 25+ years old, contains heavy data redundancy, duplicate records, and lacks modern cyber threats. UNSW-NB15 reflects contemporary high-throughput network architectures with realistic network noise and modern attack vectors.
* **Q2.2: How did UNSW-NB15 influence your 7 flow features?**
  * **Ans:** From UNSW-NB15 flow parameters, we extracted the 7 most statistically significant dimensions: login_hour, country_change_flag, download_mb, upload_mb, session_duration_sec, failed_login_count, and requests_per_minute.

---

# 📖 Paper 3: ML-Based Phishing Detection from URLs (Sahingoz et al., 2019)
> **Full Title:** *Machine Learning Based Phishing Detection from URLs*  
> **Authors:** O. K. Sahingoz, E. Buber, O. Demir, B. Diri (Expert Systems with Applications, Elsevier)

### 🎯 Main Idea & Contribution:
* Traditional anti-phishing solutions rely on **Domain Blacklists** (like Google Safe Browsing), which fail against Zero-Hour phishing attacks (phishing domains that stay alive for only 4-8 hours).
* Sahingoz et al. proved that **Lexical features of the URL itself** (without fetching or parsing heavy webpage HTML) can classify phishing links in real time with high accuracy (>97%).
* **Key Lexical Indicators identified:**
  1. **Character Distribution Entropy:** Obfuscated and DGA URLs have higher entropy.
  2. **Suspicious Keyword Tokens:** Words like login, verify, banking, update, secure, account.
  3. **Symbol Delimiters:** Use of @ (to spoof the visible host in browsers), multiple subdomains (.), and hyphens (-).
  4. **Direct IP Addressing:** Using raw IP addresses (http://192.168.1.1/...) instead of DNS domains.

### ❓ Questions Examiner Will Ask from Paper 3:
* **Q3.1: Why do attackers use the '@' symbol in URLs?**
  * **Ans:** In URI specification (RFC 3986), anything before @ is treated as userinfo (username:password), and the browser connects to the domain *after* the @ symbol (e.g. http://secure-bank.com@malicious-site.net actually navigates to malicious-site.net).
* **Q3.2: What is the benefit of Lexical URL scanning over Content-Based (DOM) scanning?**
  * **Ans:** Lexical scanning requires **zero network requests to the dangerous host**, prevents drive-by malware downloads, operates in sub-millisecond speeds, and protects users *before* the browser even connects to the target site.

---

# 📖 Paper 4: Diagnosing Network-Wide Traffic Anomalies (Lakhina et al., 2004)
> **Full Title:** *Diagnosing Network-Wide Traffic Anomalies*  
> **Authors:** Anukool Lakhina, Mark Crovella, Christophe Diot (ACM SIGCOMM)

### 🎯 Main Idea & Contribution:
* Examined how network-wide traffic flows (Origin-Destination byte rates) can be decomposed into **Normal subspace** vs **Anomaly subspace** using Principal Component Analysis (PCA).
* Demonstrated that unusual volume spikes (like massive data upload bursts) cause high coordinate projections in orthogonal error subspaces, establishing the foundation for volume-based exfiltration detection.

---

# 📖 Paper 5: Systematic Intrusion Datasets (Shiravi et al., 2012)
> **Full Title:** *Developing a Systematic Approach for Intrusion Detection Benchmark Datasets*  
> **Authors:** Ali Shiravi, Hadi Shiravi, Mahbod Tavallaee, Ali A. Ghorbani (Computers & Security)

### 🎯 Main Idea & Contribution:
* Established guidelines for generating reproducible cybersecurity datasets (ISCX / CIC-IDS).
* Emphasized multi-stage attack modeling: Reconnaissance -> Authentication Spray -> Privilege Escalation -> Data Exfiltration.
* Inspired our **4 Attack Scenario Triggers** (Safe, Brute-Force, Data Exfiltration, SYN Flood / DDoS).

---

*Guide generated for BCS554 Mini Project Viva Preparation.*
