import numpy as np

class IsolationTreeNode:
    def __init__(self, left=None, right=None, split_feature=None, split_value=None, size=0, is_leaf=False):
        self.left = left
        self.right = right
        self.split_feature = split_feature
        self.split_value = split_value
        self.size = size
        self.is_leaf = is_leaf

class IsolationTree:
    def __init__(self, max_depth):
        self.max_depth = max_depth
        self.root = None

    def fit(self, X, current_depth=0):
        n_samples, n_features = X.shape
        if current_depth >= self.max_depth or n_samples <= 1:
            return IsolationTreeNode(size=n_samples, is_leaf=True)

        feature_idx = np.random.randint(0, n_features)
        feat_min = float(np.min(X[:, feature_idx]))
        feat_max = float(np.max(X[:, feature_idx]))

        if feat_min >= feat_max:
            return IsolationTreeNode(size=n_samples, is_leaf=True)

        split_val = float(np.random.uniform(feat_min, feat_max))

        left_mask = X[:, feature_idx] < split_val
        right_mask = ~left_mask

        if np.sum(left_mask) == 0 or np.sum(right_mask) == 0:
            return IsolationTreeNode(size=n_samples, is_leaf=True)

        left_node = self.fit(X[left_mask], current_depth + 1)
        right_node = self.fit(X[right_mask], current_depth + 1)

        return IsolationTreeNode(
            left=left_node,
            right=right_node,
            split_feature=feature_idx,
            split_value=split_val,
            size=n_samples,
            is_leaf=False
        )

    def path_length(self, x, node=None, current_depth=0):
        if node is None:
            node = self.root
        if node is None or node.is_leaf:
            size = node.size if node else 1
            return current_depth + self._c(size)
        
        if x[node.split_feature] < node.split_value:
            return self.path_length(x, node.left, current_depth + 1)
        else:
            return self.path_length(x, node.right, current_depth + 1)

    @staticmethod
    def _c(n):
        if n <= 1:
            return 0.0
        if n == 2:
            return 1.0
        return 2.0 * (np.log(n - 1) + 0.5772156649) - (2.0 * (n - 1) / float(n))

class PureIsolationForest:
    def __init__(self, n_estimators=150, max_samples=256, contamination=0.06, random_state=42):
        self.n_estimators = n_estimators
        self.max_samples = max_samples
        self.contamination = contamination
        self.random_state = random_state
        self.trees = []
        self.threshold = 0.5
        self.subsample_size = 256
        self.c_val = 1.0

    def fit(self, X):
        if self.random_state is not None:
            np.random.seed(self.random_state)
        
        n_samples = X.shape[0]
        self.subsample_size = min(self.max_samples, n_samples)
        self.c_val = IsolationTree._c(self.subsample_size)
        if self.c_val == 0:
            self.c_val = 1.0

        max_depth = int(np.ceil(np.log2(max(self.subsample_size, 2))))

        self.trees = []
        for _ in range(self.n_estimators):
            sample_indices = np.random.choice(n_samples, size=self.subsample_size, replace=False)
            X_sub = X[sample_indices]
            tree = IsolationTree(max_depth=max_depth)
            tree.root = tree.fit(X_sub)
            self.trees.append(tree)

        scores = self.compute_anomaly_scores(X)
        self.threshold = float(np.percentile(scores, 100 * (1 - self.contamination)))
        return self

    def compute_anomaly_scores(self, X):
        X = np.asarray(X, dtype=np.float64)
        n_samples = X.shape[0]
        paths = np.zeros((n_samples, len(self.trees)))
        for i, tree in enumerate(self.trees):
            for j in range(n_samples):
                paths[j, i] = tree.path_length(X[j])
        
        mean_path_length = np.mean(paths, axis=1)
        scores = 2.0 ** (-mean_path_length / self.c_val)
        return scores

    def decision_function(self, X):
        scores = self.compute_anomaly_scores(X)
        return self.threshold - scores

    def predict(self, X):
        scores = self.compute_anomaly_scores(X)
        return np.where(scores >= self.threshold, -1, 1)
