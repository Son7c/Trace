import { CuratedSheet } from "./types";

export const striverSdeSheet: CuratedSheet = {
    sheetId: "striver-sde",
    title: "Striver's SDE Sheet",
    totalProblems: 191,
    sections: [
        {
            topic: "Arrays",
            problems: [
                { id: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
                { id: "pascals-triangle", title: "Pascal's Triangle", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/pascals-triangle/" },
                { id: "next-permutation", title: "Next Permutation", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/next-permutation/" },
                { id: "maximum-subarray", title: "Kadane's Algorithm (Maximum Subarray)", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-subarray/" },
                { id: "sort-colors", title: "Sort an array of 0's, 1's and 2's", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/sort-colors/" },
                { id: "best-time-to-buy-and-sell-stock", title: "Stock Buy and Sell", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" }
            ]
        },
        {
            topic: "Arrays Part-II",
            problems: [
                { id: "rotate-image", title: "Rotate Matrix", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/rotate-image/" },
                { id: "merge-intervals", title: "Merge Overlapping Subintervals", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/merge-intervals/" },
                { id: "merge-sorted-array", title: "Merge two sorted arrays without extra space", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/merge-sorted-array/" },
                { id: "find-the-duplicate-number", title: "Find the duplicate in an array of N+1 integers", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
                { id: "repeat-and-missing-number", title: "Repeat and Missing Number", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/find-missing-and-repeating2512/1" },
                { id: "inversion-of-array", title: "Inversion of Array (Pre-req: Merge Sort)", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1" }
            ]
        },
        {
            topic: "Arrays Part-III",
            problems: [
                { id: "search-a-2d-matrix", title: "Search in a 2D matrix", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
                { id: "powx-n", title: "Pow(x, n)", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/powx-n/" },
                { id: "majority-element", title: "Majority Element (>n/2 times)", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/majority-element/" },
                { id: "majority-element-ii", title: "Majority Element (n/3 times)", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/majority-element-ii/" },
                { id: "unique-paths", title: "Grid Unique Paths", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/unique-paths/" },
                { id: "reverse-pairs", title: "Reverse Pairs (Leetcode)", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/reverse-pairs/" }
            ]
        },
        {
            topic: "Arrays Part-IV",
            problems: [
                { id: "two-sum", title: "2Sum Problem", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/two-sum/" },
                { id: "4sum", title: "4-Sum Problem", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/4sum/" },
                { id: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
                { id: "largest-subarray-with-0-sum", title: "Largest Subarray with K sum (0 sum)", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1" },
                { id: "count-subarrays-with-given-xor", title: "Count number of subarrays with given xor K", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/count-subarray-with-given-xor/1" },
                { id: "longest-substring-without-repeating-characters", title: "Longest Substring without repeat", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" }
            ]
        },
        {
            topic: "Linked List",
            problems: [
                { id: "reverse-linked-list", title: "Reverse a LinkedList", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/reverse-linked-list/" },
                { id: "middle-of-the-linked-list", title: "Find the middle of LinkedList", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
                { id: "merge-two-sorted-lists", title: "Merge two sorted Linked List", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
                { id: "remove-nth-node-from-end-of-list", title: "Remove N-th node from back of LinkedList", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
                { id: "add-two-numbers", title: "Add two numbers as LinkedList", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/add-two-numbers/" },
                { id: "delete-node-in-a-linked-list", title: "Delete a given Node when a node is given (O(1))", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/delete-node-in-a-linked-list/" }
            ]
        },
        {
            topic: "Linked List Part-II",
            problems: [
                { id: "intersection-of-two-linked-lists", title: "Find intersection point of Y LinkedList", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
                { id: "linked-list-cycle", title: "Detect a cycle in Linked List", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/linked-list-cycle/" },
                { id: "reverse-nodes-in-k-group", title: "Reverse a LinkedList in groups of size k", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
                { id: "palindrome-linked-list", title: "Check if a LinkedList is palindrome or not", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/palindrome-linked-list/" },
                { id: "linked-list-cycle-ii", title: "Find the starting point of the Loop of LinkedList", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
                { id: "flattening-a-linked-list", title: "Flattening of a LinkedList", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1" }
            ]
        },
        {
            topic: "Linked List and Arrays",
            problems: [
                { id: "rotate-list", title: "Rotate a LinkedList", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/rotate-list/" },
                { id: "copy-list-with-random-pointer", title: "Clone a Linked List with random and next pointer", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
                { id: "3sum", title: "3 sum", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/3sum/" },
                { id: "trapping-rain-water", title: "Trapping Rainwater", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/trapping-rain-water/" },
                { id: "remove-duplicates-from-sorted-array", title: "Remove Duplicate from Sorted array", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
                { id: "max-consecutive-ones", title: "Max consecutive ones", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/max-consecutive-ones/" }
            ]
        },
        {
            topic: "Greedy Algorithm",
            problems: [
                { id: "n-meetings-in-one-room", title: "N meetings in one room", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1" },
                { id: "minimum-platforms", title: "Minimum number of platforms required for a railway", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1" },
                { id: "job-sequencing-problem", title: "Job sequencing Problem", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1" },
                { id: "fractional-knapsack", title: "Fractional Knapsack Problem", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1" },
                { id: "minimum-number-of-coins", title: "Greedy algorithm to find minimum number of coins", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/-minimum-number-of-coins4426/1" },
                { id: "assign-cookies", title: "Assign Cookies", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/assign-cookies/" }
            ]
        },
        {
            topic: "Recursion",
            problems: [
                { id: "subset-sums", title: "Subset Sums", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/subset-sums2234/1" },
                { id: "subsets-ii", title: "Subset-II", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/subsets-ii/" },
                { id: "combination-sum", title: "Combination sum-1", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/combination-sum/" },
                { id: "combination-sum-ii", title: "Combination sum-2", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/combination-sum-ii/" },
                { id: "palindrome-partitioning", title: "Palindrome Partitioning", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/palindrome-partitioning/" },
                { id: "permutation-sequence", title: "K-th permutation Sequence", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/permutation-sequence/" }
            ]
        },
        {
            topic: "Recursion and Backtracking",
            problems: [
                { id: "permutations", title: "Print all permutations of a string/array", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/permutations/" },
                { id: "n-queens", title: "N queens Problem", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/n-queens/" },
                { id: "sudoku-solver", title: "Sudoku Solver", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/sudoku-solver/" },
                { id: "m-coloring-problem", title: "M Coloring Problem", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1" },
                { id: "rat-in-a-maze", title: "Rat in a Maze", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1" },
                { id: "word-break-ii", title: "Word Break (print all ways)", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/word-break-ii/" }
            ]
        },
        {
            topic: "Binary Search",
            problems: [
                { id: "find-nth-root-of-m", title: "The N-th root of an integer", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/find-nth-root-of-m5843/1" },
                { id: "median-in-a-row-wise-sorted-matrix", title: "Matrix Median", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1" },
                { id: "single-element-in-a-sorted-array", title: "Find the element that appears once in a sorted array", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/single-element-in-a-sorted-array/" },
                { id: "search-in-rotated-sorted-array", title: "Search element in a sorted and rotated array", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
                { id: "median-of-two-sorted-arrays", title: "Median of 2 sorted arrays", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
                { id: "k-th-element-of-two-sorted-array", title: "K-th element of two sorted arrays", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1" },
                { id: "allocate-minimum-number-of-pages", title: "Allocate Minimum Number of Pages", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1" },
                { id: "aggressive-cows", title: "Aggressive Cows", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/aggressive-cows/1" }
            ]
        },
        {
            topic: "Heaps",
            problems: [
                { id: "implement-binary-heap", title: "Max heap, Min Heap Implementation", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/operations-on-binary-min-heap/1" },
                { id: "kth-largest-element-in-an-array", title: "Kth Largest Element", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
                { id: "maximum-sum-combinations", title: "Maximum Sum Combination", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/maximum-sum-combination/1" },
                { id: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
                { id: "merge-k-sorted-arrays", title: "Merge K sorted arrays", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1" },
                { id: "top-k-frequent-elements", title: "K most frequent elements", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/top-k-frequent-elements/" }
            ]
        },
        {
            topic: "Stack and Queue",
            problems: [
                { id: "implement-stack-using-array", title: "Implement Stack using Arrays", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/implement-stack-using-array/1" },
                { id: "implement-queue-using-array", title: "Implement Queue using Arrays", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/implement-queue-using-array/1" },
                { id: "implement-stack-using-queues", title: "Implement Stack using Queue", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/implement-stack-using-queues/" },
                { id: "implement-queue-using-stacks", title: "Implement Queue using Stack", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
                { id: "valid-parentheses", title: "Check for balanced parentheses", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/valid-parentheses/" },
                { id: "next-greater-element-i", title: "Next Greater Element", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/next-greater-element-i/" },
                { id: "sort-a-stack", title: "Sort a Stack", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/sort-a-stack/1" }
            ]
        },
        {
            topic: "Stack and Queue Part-II",
            problems: [
                { id: "nearest-smaller-element", title: "Next Smaller Element", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/smallest-number-on-left3403/1" },
                { id: "lru-cache", title: "LRU cache (IMPORTANT)", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/lru-cache/" },
                { id: "lfu-cache", title: "LFU cache", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/lfu-cache/" },
                { id: "largest-rectangle-in-histogram", title: "Largest rectangle in a histogram", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
                { id: "sliding-window-maximum", title: "Sliding Window maximum", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/sliding-window-maximum/" },
                { id: "min-stack", title: "Implement Min Stack", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/min-stack/" },
                { id: "rotting-oranges", title: "Rotten Orange (Using BFS)", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/rotting-oranges/" },
                { id: "online-stock-span", title: "Stock Span Problem", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/online-stock-span/" },
                { id: "maximum-of-minimum-for-every-window-size", title: "Find the maximum of minimums of every window size", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/maximum-of-minimum-for-every-window-size3453/1" },
                { id: "the-celebrity-problem", title: "The Celebrity Problem", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1" }
            ]
        },
        {
            topic: "String",
            problems: [
                { id: "reverse-words-in-a-string", title: "Reverse Words in a String", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/reverse-words-in-a-string/" },
                { id: "longest-palindromic-substring", title: "Longest Palindrome in a string", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
                { id: "roman-to-integer", title: "Roman Number to Integer and vice versa", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/roman-to-integer/" },
                { id: "string-to-integer-atoi", title: "Implement ATOI/STRSTR", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/string-to-integer-atoi/" },
                { id: "longest-common-prefix", title: "Longest Common Prefix", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/longest-common-prefix/" },
                { id: "repeated-string-match", title: "Rabin Karp", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/repeated-string-match/" }
            ]
        },
        {
            topic: "String Part-II",
            problems: [
                { id: "find-the-index-of-the-first-occurrence-in-a-string", title: "Z-Function / Find First Occurrence", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
                { id: "kmp-algorithm-pattern-searching", title: "KMP algo / LPS(pi) array", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/search-pattern0205/1" },
                { id: "minimum-characters-to-be-added-at-front-to-make-string-palindrome", title: "Minimum characters needed to be inserted in the beginning to make it palindromic", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/minimum-characters-to-be-added-at-front-to-make-string-palindrome/1" },
                { id: "valid-anagram", title: "Check for Anagrams", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/valid-anagram/" },
                { id: "count-and-say", title: "Count and Say", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/count-and-say/" },
                { id: "compare-version-numbers", title: "Compare version numbers", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/compare-version-numbers/" }
            ]
        },
        {
            topic: "Binary Tree",
            problems: [
                { id: "binary-tree-inorder-traversal", title: "Inorder Traversal", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
                { id: "binary-tree-preorder-traversal", title: "Preorder Traversal", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
                { id: "binary-tree-postorder-traversal", title: "Postorder Traversal", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
                { id: "morris-inorder-traversal", title: "Morris Inorder Traversal", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
                { id: "morris-preorder-traversal", title: "Morris Preorder Traversal", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/preorder-traversal-iterative/1" },
                { id: "left-view-of-binary-tree", title: "LeftView Of Binary Tree", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1" },
                { id: "bottom-view-of-binary-tree", title: "Bottom View of Binary Tree", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1" },
                { id: "top-view-of-binary-tree", title: "Top View of Binary Tree", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1" },
                { id: "tree-traversals-in-one-pass", title: "Preorder inorder postorder in a single traversal", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/postorder-traversal-iterative/1" },
                { id: "vertical-order-traversal-of-a-binary-tree", title: "Vertical order traversal", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/" },
                { id: "root-to-leaf-paths", title: "Root to Node Path in Binary Tree", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1" },
                { id: "maximum-width-of-binary-tree", title: "Max width of a Binary Tree", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-width-of-binary-tree/" }
            ]
        },
        {
            topic: "Binary Tree Part-II",
            problems: [
                { id: "binary-tree-level-order-traversal", title: "Level order Traversal / Spiral form", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
                { id: "maximum-depth-of-binary-tree", title: "Height of a Binary Tree", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
                { id: "diameter-of-binary-tree", title: "Diameter of Binary Tree", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
                { id: "balanced-binary-tree", title: "Check if the Binary tree is height-balanced or not", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/balanced-binary-tree/" },
                { id: "lowest-common-ancestor-of-a-binary-tree", title: "LCA in Binary Tree", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
                { id: "same-tree", title: "Check if two trees are identical or not", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/same-tree/" },
                { id: "binary-tree-zigzag-level-order-traversal", title: "Zig Zag Traversal of Binary Tree", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
                { id: "boundary-traversal-of-binary-tree", title: "Boundary Traversal of Binary Tree", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1" }
            ]
        },
        {
            topic: "Binary Tree Part-III",
            problems: [
                { id: "binary-tree-maximum-path-sum", title: "Maximum path sum", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
                { id: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Binary Tree from inorder and preorder", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
                { id: "construct-binary-tree-from-inorder-and-postorder-traversal", title: "Construct Binary Tree from Inorder and Postorder", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" },
                { id: "symmetric-tree", title: "Symmetric Binary Tree", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/symmetric-tree/" },
                { id: "flatten-binary-tree-to-linked-list", title: "Flatten Binary Tree to LinkedList", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
                { id: "mirror-tree", title: "Check if Binary Tree is the mirror of itself or not", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/mirror-tree/1" },
                { id: "children-sum-parent", title: "Check for Children Sum Property", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/children-sum-parent/1" }
            ]
        },
        {
            topic: "Binary Search Tree",
            problems: [
                { id: "populating-next-right-pointers-in-each-node", title: "Populate Next Right pointers of Tree", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
                { id: "search-in-a-binary-search-tree", title: "Search given Key in BST", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
                { id: "convert-sorted-array-to-binary-search-tree", title: "Construct BST from given keys", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/" },
                { id: "construct-binary-search-tree-from-preorder-traversal", title: "Construct a BST from a preorder traversal", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/" },
                { id: "validate-binary-search-tree", title: "Check is a BT is BST or not", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
                { id: "lowest-common-ancestor-of-a-binary-search-tree", title: "Find LCA of two nodes in BST", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
                { id: "predecessor-and-successor", title: "Find the inorder predecessor/successor of a given Key in BST", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/predecessor-and-successor/1" }
            ]
        },
        {
            topic: "Binary Search Tree Part-II",
            problems: [
                { id: "floor-in-bst", title: "Floor in a BST", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/floor-in-bst/1" },
                { id: "ceil-in-bst", title: "Ceil in a BST", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/implementing-ceil-in-bst/1" },
                { id: "kth-smallest-element-in-a-bst", title: "Find K-th smallest element in BST", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
                { id: "kth-largest-element-in-bst", title: "Find K-th largest element in BST", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1" },
                { id: "two-sum-iv-input-is-a-bst", title: "Find a pair with a given sum in BST", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/" },
                { id: "binary-search-tree-iterator", title: "BST iterator", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/binary-search-tree-iterator/" },
                { id: "largest-bst", title: "Size of the largest BST in a Binary Tree", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/largest-bst/1" },
                { id: "serialize-and-deserialize-binary-tree", title: "Serialize and deserialize Binary Tree", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
            ]
        },
        {
            topic: "Binary Trees [Miscellaneous]",
            problems: [
                { id: "binary-tree-to-dll", title: "Binary Tree to Double Linked List", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/binary-tree-to-dll/1" },
                { id: "find-median-from-data-stream", title: "Find median in a stream of running integers", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
                { id: "kth-largest-element-in-a-stream", title: "K-th largest element in a stream", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
                { id: "count-distinct-elements-in-every-window", title: "Distinct numbers in Window", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1" },
                { id: "kth-largest-element-in-an-array", title: "K-th largest element in an unsorted array", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
                { id: "flood-fill", title: "Flood-fill Algorithm", difficulty: "EASY", platform: "LEETCODE", url: "https://leetcode.com/problems/flood-fill/" }
            ]
        },
        {
            topic: "Graph",
            problems: [
                { id: "clone-graph", title: "Clone a graph", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/clone-graph/" },
                { id: "depth-first-traversal-for-a-graph", title: "DFS", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1" },
                { id: "bfs-traversal-of-graph", title: "BFS", difficulty: "EASY", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1" },
                { id: "detect-cycle-in-an-undirected-graph", title: "Detect A cycle in Undirected Graph using BFS", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1" },
                { id: "detect-cycle-in-an-undirected-graph-dfs", title: "Detect A cycle in Undirected Graph using DFS", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1" },
                { id: "course-schedule", title: "Detect A cycle in a Directed Graph using DFS", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/course-schedule/" },
                { id: "course-schedule-ii", title: "Detect A cycle in a Directed Graph using BFS", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/course-schedule-ii/" },
                { id: "topological-sort", title: "Topological Sort BFS", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/topological-sort/1" },
                { id: "topological-sort-dfs", title: "Topological Sort DFS", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/topological-sort/1" },
                { id: "number-of-islands", title: "Number of islands", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/number-of-islands/" },
                { id: "is-graph-bipartite", title: "Bipartite Check using BFS", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/is-graph-bipartite/" },
                { id: "is-graph-bipartite-dfs", title: "Bipartite Check using DFS", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/is-graph-bipartite/" }
            ]
        },
        {
            topic: "Graph Part-II",
            problems: [
                { id: "strongly-connected-components-kosarajus-algo", title: "Strongly Connected Component (using Kosaraju's algo)", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1" },
                { id: "implementing-dijkstra-set-1-adjacency-matrix", title: "Dijkstra's Algorithm", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1" },
                { id: "distance-from-the-source-bellman-ford-algorithm", title: "Bellman-Ford Algo", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1" },
                { id: "implementing-floyd-warshall", title: "Floyd Warshall Algorithm", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1" },
                { id: "minimum-spanning-tree", title: "MST using Prim's Algo", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1" },
                { id: "minimum-spanning-tree-kruskal", title: "MST using Kruskal's Algo", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1" }
            ]
        },
        {
            topic: "Dynamic Programming",
            problems: [
                { id: "maximum-product-subarray", title: "Max Product Subarray", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-product-subarray/" },
                { id: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
                { id: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/longest-common-subsequence/" },
                { id: "0-1-knapsack-problem", title: "0-1 Knapsack", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1" },
                { id: "edit-distance", title: "Edit Distance", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/edit-distance/" },
                { id: "maximum-sum-increasing-subsequence", title: "Maximum sum increasing subsequence", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1" },
                { id: "matrix-chain-multiplication", title: "Matrix Chain Multiplication", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1" }
            ]
        },
        {
            topic: "Dynamic Programming Part-II",
            problems: [
                { id: "minimum-path-sum", title: "Minimum sum path in the matrix", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/minimum-path-sum/" },
                { id: "coin-change", title: "Coin change", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/coin-change/" },
                { id: "partition-equal-subset-sum", title: "Subset Sum", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
                { id: "minimum-cost-to-cut-a-stick", title: "Rod Cutting", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/" },
                { id: "super-egg-drop", title: "Egg Dropping", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/super-egg-drop/" },
                { id: "word-break", title: "Word Break", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/word-break/" },
                { id: "palindromic-patitioning", title: "Palindrome Partitioning (MCM Variation)", difficulty: "HARD", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/palindromic-patitioning4845/1" },
                { id: "maximum-profit-in-job-scheduling", title: "Maximum profit in Job scheduling", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/" }
            ]
        },
        {
            topic: "Trie",
            problems: [
                { id: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
                { id: "implement-trie-ii", title: "Implement Trie - 2 (Prefix Tree)", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/trie-insert-and-search0651/1" },
                { id: "longest-word-with-all-prefixes", title: "Longest String with All Prefixes", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/find-the-longest-string--170645/1" },
                { id: "count-of-distinct-substrings", title: "Number of Distinct Substrings in a String", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/count-of-distinct-substrings/1" },
                { id: "power-set", title: "Power Set (this is very important)", difficulty: "MEDIUM", platform: "GFG", url: "https://www.geeksforgeeks.org/problems/power-set4302/1" },
                { id: "maximum-xor-of-two-numbers-in-an-array", title: "Maximum XOR of two numbers in an array", difficulty: "MEDIUM", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },
                { id: "maximum-xor-with-an-element-from-array", title: "Maximum XOR With an Element From Array", difficulty: "HARD", platform: "LEETCODE", url: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/" }
            ]
        }
    ]
};
