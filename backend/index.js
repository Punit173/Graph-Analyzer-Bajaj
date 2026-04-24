const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: 'data must be an array' });
        }

        const invalid_entries = [];
        const duplicate_edges = new Set();
        const edges_accepted = [];
        const seen_edges = new Set();
        const parent_of = new Map(); // child -> parent

        for (const rawEdge of data) {
            if (typeof rawEdge !== 'string') {
                invalid_entries.push(String(rawEdge));
                continue;
            }
            const edge = rawEdge.trim();
            const regex = /^[A-Z]->[A-Z]$/;
            if (!regex.test(edge)) {
                invalid_entries.push(edge);
                continue;
            }
            const [u, v] = edge.split('->');
            if (u === v) { // self loop
                invalid_entries.push(edge);
                continue;
            }

            // Check duplicates exactly
            if (seen_edges.has(edge)) {
                duplicate_edges.add(edge);
                continue;
            }
            seen_edges.add(edge);

            // Check multi-parent
            if (parent_of.has(v)) {
                // Ignore silently
                continue;
            }

            parent_of.set(v, u);
            edges_accepted.push({ u, v });
        }

        // Build graphs and WCCs
        const adj = new Map();
        const nodes = new Set();

        for (const { u, v } of edges_accepted) {
            if (!adj.has(u)) adj.set(u, []);
            adj.get(u).push(v);
            nodes.add(u);
            nodes.add(v);
        }

        const undir_adj = new Map();
        for (const node of nodes) undir_adj.set(node, []);
        for (const { u, v } of edges_accepted) {
            undir_adj.get(u).push(v);
            undir_adj.get(v).push(u);
        }

        const visited_nodes = new Set();
        const components = [];

        for (const node of nodes) {
            if (!visited_nodes.has(node)) {
                const comp = new Set();
                const q = [node];
                visited_nodes.add(node);
                comp.add(node);

                while (q.length > 0) {
                    const curr = q.shift();
                    const nbrs = undir_adj.get(curr) || [];
                    for (const nbr of nbrs) {
                        if (!visited_nodes.has(nbr)) {
                            visited_nodes.add(nbr);
                            comp.add(nbr);
                            q.push(nbr);
                        }
                    }
                }
                components.push(comp);
            }
        }

        let total_trees = 0;
        let total_cycles = 0;
        let max_depth = -1;
        let largest_tree_root = null;

        const hierarchies = [];

        const getDepth = (node) => {
            const children = adj.get(node) || [];
            if (children.length === 0) return 1;
            let d = 0;
            for (const child of children) {
                d = Math.max(d, getDepth(child));
            }
            return 1 + d;
        };

        const buildTreeJSON = (node) => {
            const obj = {};
            const children = adj.get(node) || [];
            children.sort();
            for (const child of children) {
                obj[child] = buildTreeJSON(child);
            }
            return obj;
        };

        for (const comp of components) {
            // Find nodes in this component with in-degree 0
            const in_degree_0 = [];
            for (const node of comp) {
                if (!parent_of.has(node)) {
                    in_degree_0.push(node);
                }
            }

            if (in_degree_0.length === 1) {
                const root = in_degree_0[0];
                total_trees++;
                const depth = getDepth(root);
                const fullTree = {};
                fullTree[root] = buildTreeJSON(root);

                hierarchies.push({
                    root: root,
                    tree: fullTree,
                    depth: depth
                });

                if (depth > max_depth) {
                    max_depth = depth;
                    largest_tree_root = root;
                } else if (depth === max_depth) {
                    if (largest_tree_root === null || root < largest_tree_root) {
                        largest_tree_root = root;
                    }
                }

            } else if (in_degree_0.length === 0) {
                total_cycles++;
                // lexical smallest node
                let root = 'Z';
                for (const node of comp) {
                    if (node < root) root = node;
                }
                hierarchies.push({
                    root: root,
                    tree: {},
                    has_cycle: true
                });
            }
        }

        res.json({
            user_id: "punitjoshi_05092005",
            email_id: "pj0964@srmist.edu.in",
            college_roll_number: "RA2311056010173",
            hierarchies,
            invalid_entries,
            duplicate_edges: Array.from(duplicate_edges),
            summary: {
                total_trees,
                total_cycles,
                largest_tree_root
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
