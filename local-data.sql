--
-- PostgreSQL database dump
--

\restrict Hf50CFV3yKqROluf3D8VB66u4iw9nqPXtQU2HE0SI9ND326YElwonfbSSkhV9EN

-- Dumped from database version 16.10 (Homebrew)
-- Dumped by pg_dump version 16.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Blog" VALUES (7, 'go-service-observability', 'Go 服务观测实战：pprof + OpenTelemetry', '这篇笔记记录了我们在 Go 服务中接入 pprof 与 OpenTelemetry 的实践，重点是采样开销与指标面板设计。

核心步骤：
1. 在 HTTP 服务挂载 /debug/pprof，结合火焰图快速定位热点。
2. 使用 OTLP 导出 trace/span，并在 Jaeger 上串联请求链路。
3. 将 Go runtime 指标暴露到 Prometheus，针对 GC pause、goroutine 数做阈值告警。

实践 tip：生产环境建议定时采样而不是全量采集，避免影响 P99 延迟。', true, '2025-11-29 15:33:00.392', '2025-11-29 15:33:00.392');
INSERT INTO public."Blog" VALUES (9, 'kafka-exactly-once-guide', 'Kafka 实战：从 at-least-once 到 exactly-once', '本文用一个订单流水的案例解释 Kafka 消费语义：

1. at-least-once：开启手动提交 offset，失败重试会导致重复消费，需要幂等落库。
2. at-most-once：自动提交 offset，失败不重放，可能数据丢失。
3. exactly-once：使用事务性 producer + 幂等 consumer 端落表，配合外部存储的幂等键。

遇到的坑：事务性生产者要求 broker 配置 `transaction.state.log.replication.factor`，否则会报初始化失败。', true, '2025-11-29 15:33:00.776', '2025-11-29 15:33:00.776');
INSERT INTO public."Blog" VALUES (10, 'postgres-index-tuning', 'Postgres 索引调优：Explain 与常见误区', '记录一次调优经验：查询使用组合条件 (user_id, created_at)，但仅建了单列索引。

优化步骤：
- 用 `EXPLAIN (ANALYZE, BUFFERS)` 查看是否走 Seq Scan。
- 添加复合索引 `(user_id, created_at DESC)` 后，查询延迟从 800ms 降到 40ms。
- 注意避免在 where 上对索引列使用函数，导致索引失效。

复盘：写查询前先想好过滤条件的选择性，预先规划组合索引。', true, '2025-11-29 15:33:00.859', '2025-11-29 15:33:00.859');
INSERT INTO public."Blog" VALUES (8, 'react-forms-best-practices', 'React 表单最佳实践：hooks、受控与性能', '总结最近在 React 表单开发中的经验，主要围绕三个问题：

- 受控组件与非受控的取舍：简单表单用受控保持一致性，复杂大表单用 ref + watch 减少重渲染。
- 状态管理：用 react-hook-form 管理注册/验证，结合 zod 做 schema 校验。
- 性能：拆分字段组件，配合 React.memo + useCallback，避免级联重渲染。

示例代码片段：
```tsx
const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })
return <input {...register(''email'')} className="input" />
```
', true, '2025-11-29 15:33:00.634', '2025-11-30 14:46:33.176');


--
-- Data for Name: BlogTag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BlogTag" VALUES (5, 'go', 'BLOG');
INSERT INTO public."BlogTag" VALUES (8, 'performance', 'BLOG');
INSERT INTO public."BlogTag" VALUES (7, 'architecture', 'BLOG');
INSERT INTO public."BlogTag" VALUES (10, 'postgres', 'BLOG');
INSERT INTO public."BlogTag" VALUES (11, 'observability', 'BLOG');
INSERT INTO public."BlogTag" VALUES (12, 'react', 'BLOG');


--
-- Data for Name: Echo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Echo" VALUES (7, 'footer', true, 'Keep shipping, keep learning.', '2025-11-29 15:33:01.152');


--
-- Data for Name: Note; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Note" VALUES (18, 'subarraySum', 'hot100-和为k的子数组个数', '### hot100——和为k的子数组个数

给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

子数组是数组中元素的连续非空序列。


示例 1：

输入：nums = [1,1,1], k = 2

输出：2

示例 2：

输入：nums = [1,2,3], k = 3

输出：2
 

提示：

1 <= nums.length <= 2 * 104

-1000 <= nums[i] <= 1000

-107 <= k <= 107


## 解
```go
//核心：prefixSum[i]-prefixSum[j]=k，类似于两数之和
func subarraySum(nums []int, k int) int {
    sumMap := make(map[int]int)
    sumMap[0] = 1       // 前缀和为 0 出现 1 次（空子数组）
    prefixSum := 0
    result := 0
    for _, v := range nums {
        prefixSum += v
        // 查找是否存在前缀和 = prefixSum - k
        if count, ok := sumMap[prefixSum-k]; ok {
            result += count
        }
        // ✅ 关键：累加当前前缀和的出现次数
        sumMap[prefixSum]++
    }
    return result
}
```', true, '2025-12-24 16:58:45.603', '2025-12-24 17:09:45.417');
INSERT INTO public."Note" VALUES (11, 'groupAnagrams', 'hot100-字母异位词分组', '### hot100——字母异位词分组

给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。

示例 1:

输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]

输出: [["bat"],["nat","tan"],["ate","eat","tea"]]

解释：

在 strs 中没有字符串可以通过重新排列来形成 "bat"。
字符串 "nat" 和 "tan" 是字母异位词，因为它们可以重新排列以形成彼此。
字符串 "ate" ，"eat" 和 "tea" 是字母异位词，因为它们可以重新排列以形成彼此。
示例 2:

输入: strs = [""]

输出: [[""]]

示例 3:

输入: strs = ["a"]

输出: [["a"]]

 
提示：

1 <= strs.length <= 104

0 <= strs[i].length <= 100

strs[i] 仅包含小写字母

### 解

```go
import (
    "sort"
    "strings"
)
func groupAnagrams(strs []string) [][]string {
    listMap := make(map[string][]string)
        for _, s := range strs {
            //将数组中的每个字符串分割（"eat"=>''e'',''a'',''t''）
            charSlice := strings.Split(s, "")
            //排序（''e'',''a'',''t''=> ''a'',''e'',''t''）
            sort.Strings(charSlice)
            //再把单个字符合并成字符串（''e'',''a'',''t''=>"eat"）
            key := strings.Join(charSlice, "")
            //key值相同的合并
            listMap[key] = append(listMap[key], s)
        }
        //转换为数组
        result := make([][]string, 0, len(listMap))
        for _, s := range listMap {
            result = append(result, s)
        }
	return result
        
}
```', true, '2025-12-22 19:39:10.646', '2025-12-23 22:43:02.745');
INSERT INTO public."Note" VALUES (10, 'longestConsecutive', 'hot100-最长连续序列', '### hot100——最长连续序列

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

示例 1：

输入：nums = [100,4,200,1,3,2]

输出：4

解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。

示例 2：

输入：nums = [0,3,7,2,5,8,4,6,0,1]

输出：9

示例 3：

输入：nums = [1,0,1,2]

输出：3
 

提示：

0 <= nums.length <= 105

-109 <= nums[i] <= 109

## 解：
```go
func longestConsecutive(nums []int) int {
    numMap := make(map[int]bool, len(nums))
    //把数组中每个元素存在map中，只需要知道它存不存在，所以值用true/false即可
    for _, num := range nums {
        numMap[num] = true
    }
    MaxLength := 0
    //需要知道当前元素（如5）的前一位（4）存不存在，存在则继续往前推，因为我们需要的是连续最长序列，碰到前一位还有的（没有间断的，不是起点）直接跳过
    for num, _ := range numMap {
        if numMap[num-1] {
            continue
        }
        //走到这里说明当前元素前一位没有，可以作为起点
        currentNum := num
        currentLength := 1
        //依次判断后方连续的元素均存在
        for numMap[currentNum+1] {
            currentNum++
            currentLength++
        }
        //将寻找到的连续序列赋值给MaxLength
        if currentLength > MaxLength {
            MaxLength = currentLength
        }

    }
    return MaxLength
}
```', true, '2025-12-22 18:00:10.569', '2025-12-23 22:44:10.668');
INSERT INTO public."Note" VALUES (6, 'go-context-cancellation', 'Go context 取消最佳实践', '一句话：只在入口创建 context，向下传递，确保 defer cancel。

- HTTP handler 收到请求创建 ctx，超时 2-3s 合理。
- goroutine 里要监听 ctx.Done，避免泄漏。
- 调第三方接口时可用 context.WithTimeout 包装。', true, '2025-11-29 15:33:01.043', '2025-11-29 15:33:01.043');
INSERT INTO public."Note" VALUES (7, 'react-query-stale-time', 'React Query 的 staleTime 设置', 'staleTime 用来降低重复请求：

- 列表页可设 30s，切换 tab 不会立即 refetch。
- 详情页可更短，确保数据新鲜。
- 后台更新频繁的页面仍需启用 refetchOnWindowFocus。', true, '2025-11-29 15:33:01.087', '2025-11-29 15:33:01.087');
INSERT INTO public."Note" VALUES (8, 'kafka-partitioning', 'Kafka 分区选择小记', '分区数量决定吞吐与有序性：

- 需要按用户有序消费时，用 user_id 作为 key 保证落同一分区。
- 提前规划分区数，避免后期扩分区打乱顺序。
- 高吞吐场景优先考虑批量生产和压缩（lz4/zstd）。', true, '2025-11-29 15:33:01.107', '2025-11-29 15:33:01.107');
INSERT INTO public."Note" VALUES (14, 'trap', 'hot100-接雨水', '### hot100——接雨水

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

 

示例 1：


![image.png](https://utfs.io/f/51vRr4GGrTuZLbWoxqtpV6Z5r4hTU3IfBDtF9OMmWuvC1RAw)

输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]

输出：6

解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。

示例 2：

输入：height = [4,2,0,3,2,5]

输出：9
 

提示：

n == height.length

1 <= n <= 2 * 104

0 <= height[i] <= 105


## 解
```go
func trap(height []int) int {
    //定义左右挡板，分别用来接往左右两边流的雨水
    leftMax, rightMax := 0, 0
    //左右指针
    left, right := 0, len(height)-1
    result := 0
    for left < right {
        //更新左右挡板
        leftMax = max(leftMax, height[left])
        rightMax = max(rightMax, height[right])
        //右边大，水会往左流
        if height[left] < height[right] {
            //接左边的雨水
            result += leftMax - height[left]
            left++
        } else {
            //接右边的雨水
            result += rightMax - height[right]
            right--
        }
    }
    return result
}
```', true, '2025-12-23 17:08:57.537', '2025-12-23 22:45:39.1');
INSERT INTO public."Note" VALUES (12, 'threeSum', 'hot100-三数之和', '### hot100——三数之和

给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

 
示例 1：

输入：nums = [-1,0,1,2,-1,-4]

输出：[[-1,-1,2],[-1,0,1]]

解释：

nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。

nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。

nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。

不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。

注意，输出的顺序和三元组的顺序并不重要。

示例 2：

输入：nums = [0,1,1]

输出：[]

解释：唯一可能的三元组和不为 0 。

示例 3：

输入：nums = [0,0,0]

输出：[[0,0,0]]

解释：唯一可能的三元组和为 0 。
 

提示：

3 <= nums.length <= 3000

-105 <= nums[i] <= 105


## 解
```go
import "sort"
func threeSum(nums []int) [][]int {
  //对原数组排序
  sort.Ints(nums)
  result := [][]int{}
  for i := 0; i < len(nums); i++ {
    if nums[i] > 0 {
        break
    }
    //避免重复三元组
    if i > 0 && nums[i] == nums[i-1] {
        continue
    }
    //从当前值右边和末尾开始找
    left, right := i+1, len(nums)-1
    for left < right {
        sum := nums[i] + nums[left] + nums[right]
        //满足题解
        if sum == 0 {
            result = append(result, []int{nums[i], nums[left], nums[right]})
            //确保left和right移动过后依然满足left<right
            for left < right && nums[left] == nums[left+1] {
                left++
            }
            for left < right && nums[right] == nums[right-1] {
                right--
            }
            //寻找下一个解
            left++
            right--
        } else if sum > 0 {
            //值大了，右指针往左移（已经是顺序了）
            right--
        } else {
            //值小了，左指针右移
            left++
        }

    }

  }  
  return result
}
```', true, '2025-12-22 23:55:44.5', '2025-12-23 22:44:59.787');
INSERT INTO public."Note" VALUES (13, 'maxArea', 'hot100-盛最多水的容器', '### hot100——盛最多水的容器

给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

说明：你不能倾斜容器。


示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZ5hjHJvGGrTuZbUz6WM2qQwck3gPJIyXR7i0n)

输入：[1,8,6,2,5,4,8,3,7]

输出：49 

解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。

示例 2：

输入：height = [1,1]

输出：1
 

提示：

n == height.length

2 <= n <= 105

0 <= height[i] <= 104

## 解
```go
func maxArea(height []int) int {
    //双指针
    left, right := 0, len(height)-1
    result := 0
    for left < right {
        //面积是由最小高度的那边决定
        area := (right - left) * min(height[left], height[right])
        result = max(result, area)
        //右边低的话往左移
        if height[left] > height[right] {
            right--
        } else {
            left++   //左边低的话往右移
        }
    }
    return result
}
```', true, '2025-12-23 15:06:13.767', '2025-12-23 22:45:20.658');
INSERT INTO public."Note" VALUES (15, 'moveZeroes', 'hot100-移动零', '### hot100——移动零

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

请注意 ，必须在不复制数组的情况下原地对数组进行操作。

 

示例 1:

输入: nums = [0,1,0,3,12]

输出: [1,3,12,0,0]

示例 2:

输入: nums = [0]

输出: [0]
 

提示:

1 <= nums.length <= 104

-231 <= nums[i] <= 231 - 1

## 解
```go
func moveZeroes(nums []int)  {
    //用于交换0的指针
    left := 0
    for i := 0; i < len(nums); i++ {
        //遇到非0就与左指针交换位置
        if nums[i] != 0 {
            nums[i], nums[left] = nums[left], nums[i]
            left++
        }
    }
}
```', true, '2025-12-23 17:26:15.083', '2025-12-23 22:45:54.765');
INSERT INTO public."Note" VALUES (9, 'twosums', 'hot100-两数之和', '### hot100——两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

示例 1：

输入：nums = [2,7,11,15], target = 9

输出：[0,1]

解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

示例 2：

输入：nums = [3,2,4], target = 6

输出：[1,2]

示例 3：

输入：nums = [3,3], target = 6

输出：[0,1]
 

提示：

2 <= nums.length <= 104

-109 <= nums[i] <= 109

-109 <= target <= 109

只会存在一个有效答案



## 解：
```go
func twoSum(nums []int, target int) []int {
    // 使用map保证时间复杂度为o(n)
    numMap := make(map[int]int, len(nums))
    for k, v := range nums {
        //遍历数组中每个元素，直接在numMap中寻找是否存在满足当前条件的元素
        if value, ok := numMap[target - v]; ok {
            return []int{value, k}
        }
        //用值当key，value为索引，因为我们只需要下标
        numMap[v] = k
    }
    return []int{}   // 确保一定有返回值
}
```', true, '2025-12-22 17:44:31.988', '2025-12-23 22:43:47.229');
INSERT INTO public."Note" VALUES (17, 'findAnagrams', 'hot100-找到字符串中所有字母异位词', '### hot100——找到字符串中所有字母异位词

给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。


示例 1:

输入: s = "cbaebabacd", p = "abc"

输出: [0,6]

解释:

起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。

起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。

示例 2:

输入: s = "abab", p = "ab"

输出: [0,1,2]

解释:

起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。

起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。

起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
 

提示:

1 <= s.length, p.length <= 3 * 104

s 和 p 仅包含小写字母

## 解
```go
// findAnagrams 找出字符串 s 中所有 p 的字母异位词的起始索引
func findAnagrams(s string, p string) []int {
    // arr 用于记录“还需要多少个字符”才能匹配 p
    // 初始时：arr[c] = p 中字符 c 的出现次数
    // 随着遍历 s，我们“消耗”这些次数（做减法）
    arr := [26]int{}

    // 滑动窗口左边界（包含）
    left := 0

    // 存储结果（所有异位词的起始位置）
    result := []int{}

    // 初始化 arr：统计 p 中每个字符的频次
    for _, c := range p {
        arr[c-''a'']++ // ''a''→0, ''b''→1, ..., ''z''→25，得到的结果就是arr[0]=1/0(''a''出现一次或0次),arr[1]=1/0(''b''出现一次或0次)
    }

    // right 是滑动窗口的右边界（包含），遍历 s
    for right := 0; right < len(s); right++ {
        // 将 s[right] 加入窗口：消耗一个该字符的“配额”
        arr[s[right]-''a'']--

        // 如果某个字符被“过度消耗”（< 0），说明窗口内该字符太多
        // → 需要移动左边界，直到不再超额
        for arr[s[right]-''a''] < 0 {
            // 把 left 处的字符“归还”（因为它要被移出窗口）
            arr[s[left]-''a'']++
            left++
        }

        // 当前窗口 [left, right] 是无超额的（即所有字符数量 ≤ p 中的数量）
        // 如果窗口长度正好等于 len(p)，说明字符种类和数量完全匹配！
        if right-left+1 == len(p) {
            result = append(result, left)
        }
    }

    return result
}
```', true, '2025-12-24 15:28:18.19', '2025-12-24 15:28:18.19');
INSERT INTO public."Note" VALUES (16, 'lengthOfLongestSubstring', 'hot100-无重复字符的最大字串', '### hot100——无重复字符的最大字串

给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。

 
示例 1:

输入: s = "abcabcbb"

输出: 3 

解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。注意 "bca" 和 "cab" 也是正确答案。

示例 2:

输入: s = "bbbbb"

输出: 1

解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

示例 3:

输入: s = "pwwkew"

输出: 3

解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。

请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 

提示：

0 <= s.length <= 5 * 104

s 由英文字母、数字、符号和空格组成


## 解
```go
func lengthOfLongestSubstring(s string) int {
    //使用map存储遍历后的字符
    sMap := make(map[byte]int)
    //滑动窗口左边
    left := 0
    result := 0
    for right := 0; right < len(s); right++ {
        c := s[right]
        //在map里遇到重复的字符，且当前重复字符在滑动窗口内（i>=left）
        if i, ok := sMap[c]; ok && i >= left {
           // 立刻改变滑动窗口的左边界
           left = sMap[c] + 1
        }
        //没遇到重复的字符直接放入map中（拓宽右边界），存的是下标；重复的话更新左边界
        sMap[c] = right
        // 计算当前窗口 [left, right] 的长度，并更新最大长度
        result = max(result, right-left+1)
    }
    return result
}
```', true, '2025-12-23 21:54:43.996', '2025-12-31 14:45:49.762');
INSERT INTO public."Note" VALUES (19, 'maxSlidingWindow', 'hot100-滑动窗口最大值', '### hot100——滑动窗口最大值

给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回 滑动窗口中的最大值 。

 

示例 1：

输入：nums = [1,3,-1,-3,5,3,6,7], k = 3

输出：[3,3,5,5,6,7]

解释：

滑动窗口的位置                最大值

[1  3  -1] -3  5  3  6  7       3

 1 [3  -1  -3] 5  3  6  7       3
 
 1  3 [-1  -3  5] 3  6  7       5
 
 1  3  -1 [-3  5  3] 6  7       5
 
 1  3  -1  -3 [5  3  6] 7       6
 
 1  3  -1  -3  5 [3  6  7]      7
 
示例 2：

输入：nums = [1], k = 1

输出：[1]
 

提示：

1 <= nums.length <= 105

-104 <= nums[i] <= 104

1 <= k <= nums.length


## 解
```go
func maxSlidingWindow(nums []int, k int) []int {
    // que 是一个双端队列（用切片模拟），存储的是 nums 的下标（不是值！）
    // 队列中下标对应的 nums 值从队首到队尾严格递减
    que := []int{}
    // result 存储每个窗口的最大值
    result := []int{}
    // 遍历数组中的每个元素
    for i := 0; i < len(nums); i++ {
        // 【关键1：维护队列单调性】
        // 从队列尾部开始，移除所有对应值小于当前 nums[i] 的下标
        // 因为这些元素既比 nums[i] 小，又在 nums[i] 左边，
        // 所以在后续窗口中永远不可能成为最大值，可以安全丢弃
        for len(que) > 0 && nums[que[len(que)-1]] < nums[i] {
            que = que[:len(que)-1] // 弹出队尾
        }
        // 将当前下标 i 加入队尾
        que = append(que, i)
        // 【关键2：移除过期元素】
        // 如果队首下标已经不在当前窗口 [i-k+1, i] 范围内（即 <= i-k），
        // 说明它已滑出窗口左侧，需要从队首移除
        if que[0] < i-k+1 {
            que = que[1:] // 移除队首（逻辑上 O(1) 摊还）
        }
        // 【关键3：记录结果】
        // 当 i >= k-1 时，第一个完整窗口形成（窗口包含下标 [0, ..., k-1]）
        // 此后每个 i 都对应一个完整窗口，队首下标 que[0] 对应的值就是当前窗口最大值
        if i >= k-1 {
            result = append(result, nums[que[0]])
        }
    }
    
    return result
}
```
', true, '2025-12-24 19:49:25.987', '2025-12-25 12:34:16.308');
INSERT INTO public."Note" VALUES (21, 'merge', 'hot100-合并区间', '### hot100——合并区间

以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

示例 1：

输入：intervals = [[1,3],[2,6],[8,10],[15,18]]

输出：[[1,6],[8,10],[15,18]]

解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].

示例 2：

输入：intervals = [[1,4],[4,5]]

输出：[[1,5]]

解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。

示例 3：

输入：intervals = [[4,7],[1,4]]

输出：[[1,7]]

解释：区间 [1,4] 和 [4,7] 可被视为重叠区间。
 

提示：

1 <= intervals.length <= 104

intervals[i].length == 2

0 <= starti <= endi <= 104



## 解
```go
import "sort"
func merge(intervals [][]int) [][]int {
     // 排序（根据每个区间的其实位置进行排序）
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    result := [][]int{}
    for _, arr := range intervals {
        // 因为已经排序了，直接比较result里最后一个区间的结束位置和当前区间的起始位置的大小
        if len(result) != 0 && result[len(result)-1][1] >= arr[0] {
            // 有重叠，最后一个区间的结束位置更新为当前区间结束位置和原结束位置中的较大值
            result[len(result)-1][1] = max(result[len(result)-1][1], arr[1])
        } else {
            // 无重叠，直接加入即可
            result = append(result, arr)
        }
    }
    return result
}
```', true, '2025-12-29 19:58:22.486', '2025-12-29 19:58:22.486');
INSERT INTO public."Note" VALUES (20, 'maxSubArray', 'hot100-最大子数组和', '### hot100——最大子数组和

给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组是数组中的一个连续部分。

 

示例 1：

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]

输出：6

解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。

示例 2：

输入：nums = [1]

输出：1

示例 3：

输入：nums = [5,4,-1,7,8]

输出：23
 

提示：

1 <= nums.length <= 105

-104 <= nums[i] <= 104


## 解
```go
 Kadane 算法核心思想
“如果当前累加和变成负数，就丢弃前面的所有，从下一个元素重新开始。”

为什么？
负数前缀只会拉低后续总和
任何以负数开头的子数组，都不如直接从后面正数开始
解1:
func maxSubArray(nums []int) int {
    result := nums[0]
    sum := 0
    for _, num := range nums {
        sum += num
        result = max(result, sum)
        // 如果当前和为负，就放弃前面所有
        if sum < 0 {
            sum = 0
        }
    }
    return result
}
// 解2:
// func maxSubArray(nums []int) int {
//     // 核心：result = sum[i] - minSum（当前前缀和 - 历史最小前缀和）
//     sum := 0
//     minSum := 0
//     //防止数组只有一个元素（且为负），所以这个位置不能初始化为0
//     result := nums[0]
//     for _, num := range nums {
//         sum += num
//         result = max(result, sum - minSum)
//         minSum = min(minSum, sum)
//     }
//     return result
// }
```
', true, '2025-12-25 23:18:20.743', '2025-12-25 23:29:44.555');
INSERT INTO public."Note" VALUES (22, 'productExceptSelf', 'hot100-除了自身以外数组的乘积', '### hot100——除了自身以外数组的乘积

给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除了 nums[i] 之外其余各元素的乘积 。

题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

请 不要使用除法，且在 O(n) 时间复杂度内完成此题。

 

示例 1:

输入: nums = [1,2,3,4]

输出: [24,12,8,6]

示例 2:

输入: nums = [-1,1,0,-3,3]

输出: [0,0,9,0,0]
 

提示：

2 <= nums.length <= 105

-30 <= nums[i] <= 30

输入 保证 数组 answer[i] 在  32 位 整数范围内



## 解
```go
func productExceptSelf(nums []int) []int {
    // 创建结果数组，长度与输入数组相同
    result := make([]int, len(nums))
    
    // 第一步：计算每个元素左侧所有元素的乘积
    // 第一个元素左侧没有元素，所以初始化为1
    result[0] = 1
    
    // 遍历数组，计算每个位置左侧所有元素的乘积
    // 例如：result[i] = nums[0] × nums[1] × ... × nums[i-1]
    for i := 1; i < len(nums); i++ {
        // 当前元素的左侧乘积 = 前一个元素的左侧乘积 × 前一个元素的值
        result[i] = result[i-1] * nums[i-1]
    }
    
    // 第二步：计算每个元素右侧所有元素的乘积，并乘到结果中
    // 使用变量 right 记录当前元素右侧所有元素的乘积
    // 从最后一个元素开始向左遍历
    right := 1
    
    // 从后向前遍历数组
    for i := len(nums)-1; i >= 0; i-- {
        // 关键步骤：先使用当前的right（不包含nums[i]）
        // result[i]当前存储的是左侧乘积，乘以right得到最终结果
        result[i] = result[i] * right
        
        // 然后更新right，将当前元素乘入right
        // 更新后的right将作为下一个（左侧）元素的右侧乘积
        right = right * nums[i]
    }
    
    // 返回最终结果
    return result
}
```', true, '2025-12-29 23:49:24.422', '2025-12-29 23:49:24.422');
INSERT INTO public."Note" VALUES (34, 'inorderTraversal', 'hot100-二叉树的中序遍历', '### hot100——二叉树的中序遍历

给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZaNXFTn7oIGCeKNfyb6cDnqwzLMaAYp2iTk3t)

输入：root = [1,null,2,3]

输出：[1,3,2]

示例 2：

输入：root = []

输出：[]

示例 3：

输入：root = [1]

输出：[1]

提示：

树中节点数目在范围 [0, 100] 内

-100 <= Node.val <= 100


### 解法：
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

func inorderTraversal(root *TreeNode) []int {
    res := make([]int, 0)
    inorder(root, &res)
    return res
}

func inorder(node *TreeNode, res *[]int) {
    if node == nil {
        return
    }
    inorder(node.Left, res)      // 左
    *res = append(*res, node.Val) // 根
    inorder(node.Right, res)     // 右
}
```
 


', true, '2026-02-12 00:12:13.417', '2026-02-12 00:12:59.852');
INSERT INTO public."Note" VALUES (24, 'searchMatrix', 'hot100-搜索二维矩阵II', '### hot100——搜索二维矩阵II

编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：

每行的元素从左到右升序排列。
每列的元素从上到下升序排列。
 

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZXEqlmJaJEvQo9nBKjft4rH0gYep7zIPhCGyS)

输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],
[10,13,14,17,24],[18,21,23,26,30]], target = 5

输出：true

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZf4bnPV34PfogMh21Vi6rW9OT7ekHNSDAvCmY)

输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20

输出：false
 


提示：

m == matrix.length

n == matrix[i].length

1 <= n, m <= 300

-109 <= matrix[i][j] <= 109

每行的所有元素从左到右升序排列

每列的所有元素从上到下升序排列

-109 <= target <= 109



## 解
```go
func searchMatrix(matrix [][]int, target int) bool {
    m, n := len(matrix), len(matrix[0])
    //从矩阵的右上角开始找
    row, col := 0, n-1
    for row < m && col >= 0 {
        if target == matrix[row][col] {
            return true
        //大了就往下一行（依次最右边开始往左边找）
        } else if target > matrix[row][col] {
            row++
        } else {
            col--
        }
    }
    return false
}
```', true, '2026-01-01 23:27:51.097', '2026-01-01 23:49:59.767');
INSERT INTO public."Note" VALUES (35, 'maxDepth', 'hot100-二叉树的最大深度', '### hot100——二叉树的最大深度

给定一个二叉树 root ，返回其最大深度。

二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZull8pdRDkaRzE6dute218m7NKfAPYxJ4vcQI)

输入：root = [3,9,20,null,null,15,7]

输出：3

示例 2：

输入：root = [1,null,2]

输出：2
 

提示：

树中节点的数量在 [0, $10^4$] 区间内。

-100 <= Node.val <= 100


### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    leftDepth := maxDepth(root.Left)
    rightDepth := maxDepth(root.Right)
    if leftDepth > rightDepth {
        return leftDepth + 1
    } else {
        return rightDepth + 1
    }
}
```', true, '2026-02-13 20:07:59.582', '2026-02-13 20:09:11.008');
INSERT INTO public."Note" VALUES (36, 'invertTree', 'hot100-翻转二叉树', '### hot100——翻转二叉树

给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。

示例 1：
![image.png](https://utfs.io/f/51vRr4GGrTuZGcxdd9ubAV4loP3jvGD8wnhUYr9dFqiC06kx)

输入：root = [4,2,7,1,3,6,9]

输出：[4,7,2,9,6,3,1]

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZR6z7nehygG832NVpILurzctHf7oEDTd9jwKa)

输入：root = [2,1,3]

输出：[2,3,1]

示例 3：

输入：root = []

输出：[]
 

提示：

树中节点数目范围在 [0, 100] 内

-100 <= Node.val <= 100


### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
 func invertTree(root *TreeNode) *TreeNode {
    // 1. 基线条件
    if root == nil {
        return nil
    }
    // 2. 交换左右子树（当前层的处理）
    root.Left, root.Right = root.Right, root.Left
    // 3. 递归处理子问题
    invertTree(root.Left)
    invertTree(root.Right)
    // 4. 返回结果（原根节点已修改，直接返回）
    return root
}
```', true, '2026-02-13 21:11:44.079', '2026-02-13 21:12:46.827');
INSERT INTO public."Note" VALUES (23, 'rotateImage', 'hot100-旋转图像', '### hot100——旋转图像

给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。


示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZQHGiM6fezvOfMsgFB7N8Z4K0yaHphDbnUCAc)

输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]

输出：[[7,4,1],[8,5,2],[9,6,3]]

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZuu7JqZRDkaRzE6dute218m7NKfAPYxJ4vcQI)

输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]

输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
 

提示：

n == matrix.length == matrix[i].length

1 <= n <= 20

-1000 <= matrix[i][j] <= 1000



## 解
```go
func rotate(matrix [][]int)  {
    // 先沿对角线翻转元素
    for i := 0; i < len(matrix); i++ {
        for j := i; j < len(matrix); j++ {
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        }
    }
    // 再反转每一行
    for i := 0; i < len(matrix); i++ {
        for j := 0; j < len(matrix)/2; j++ {
            matrix[i][j], matrix[i][len(matrix)-1-j] = 
            matrix[i][len(matrix)-1-j], matrix[i][j]
        }
    }
}
```
', true, '2025-12-31 22:29:48.55', '2025-12-31 22:40:00.121');
INSERT INTO public."Note" VALUES (27, 'isPalindrome', 'hot100-回文链表', '### hot100——回文链表

给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。

示例 1：

输入：head = [1,2,2,1]

输出：true

示例 2：

输入：head = [1,2]

输出：false
 

提示：

链表中节点数目在范围[1, 105] 内

0 <= Node.val <= 9



## 解法
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func isPalindrome(head *ListNode) bool {
    // Step 1: 快慢指针找中点
    slow, fast := head, head
    for fast.Next != nil && fast.Next.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    // 此时 slow 指向：
    // - 奇数长度：中间节点（如 1→2→3→2→1 → slow=3）
    // - 偶数长度：前半部分最后一个（如 1→2→2→1 → slow=第一个2）
    
    // Step 2: 反转后半部分（从 slow.Next 开始）
    var prev *ListNode
    curr := slow.Next
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    // prev 现在是反转后的新头（即原链表尾）

    // Step 3: 比较前半部分和反转后的后半部分
    p1 := head       // 从前向后
    p2 := prev       // 从后向前（因已反转）
    for p2 != nil {  // 后半部分长度 ≤ 前半部分，只需遍历 p2
        if p1.Val != p2.Val {
            return false
        }
        p1 = p1.Next
        p2 = p2.Next
    }

    return true
}
```
', true, '2026-01-04 21:21:14.62', '2026-01-04 21:40:52.07');
INSERT INTO public."Note" VALUES (26, 'reverseList', 'hot100-反转链表', '### hot100——反转链表

给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 
示例 1：
![image.png](https://utfs.io/f/51vRr4GGrTuZHNJA0SMvdwKmQJUfar8snS1VOj72uPx6EAvG)
输入：head = [1,2,3,4,5]

输出：[5,4,3,2,1]

示例 2：
![image.png](https://utfs.io/f/51vRr4GGrTuZa0ySQQ7oIGCeKNfyb6cDnqwzLMaAYp2iTk3t)

输入：head = [1,2]

输出：[2,1]

示例 3：

输入：head = []

输出：[]
 

提示：

链表中节点的数目范围是 [0, 5000]

-5000 <= Node.val <= 5000


## 解
```go
func reverseList(head *ListNode) *ListNode {
    // prev 指向已反转部分的头节点，初始时没有已反转部分，所以为 nil
    var prev *ListNode = nil
    // curr 指向当前正在处理的节点，从原链表的头节点开始
    curr := head
    // 只要当前节点不为空，就继续处理
    for curr != nil {
        // 1. 保存当前节点的下一个节点，防止反转指针后丢失后续链表
        next := curr.Next  
        // 2. 将当前节点的 Next 指针指向前一个节点（即反转方向）
        curr.Next = prev
        // 3. 将 prev 向前移动：现在 curr 已加入反转部分，成为新的头
        prev = curr
        // 4. 将 curr 向前移动到下一个待处理的节点（即之前保存的 next）
        curr = next
    }
    // 循环结束时，curr 为 nil，prev 指向原链表的最后一个节点，
    // 也就是反转后新链表的头节点，因此返回 prev
    return prev
}
```', true, '2026-01-04 14:42:15.92', '2026-01-04 14:45:35.209');
INSERT INTO public."Note" VALUES (25, 'getIntersectionNode', 'hot100-相交链表', '### hot100——相交链表

给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

图示两个链表在节点 c1 开始相交：

![image.png](https://utfs.io/f/51vRr4GGrTuZfSW7qv34PfogMh21Vi6rW9OT7ekHNSDAvCmY)

题目数据 保证 整个链式结构中不存在环。

注意，函数返回结果后，链表必须 保持其原始结构 。

自定义评测：

评测系统 的输入如下（你设计的程序 不适用 此输入）：

intersectVal - 相交的起始节点的值。如果不存在相交节点，这一值为 0

listA - 第一个链表

listB - 第二个链表

skipA - 在 listA 中（从头节点开始）跳到交叉节点的节点数

skipB - 在 listB 中（从头节点开始）跳到交叉节点的节点数

评测系统将根据这些输入创建链式数据结构，并将两个头节点 headA 和 headB 传递给你的程序。如果程序能够正确返回相交节点，那么你的解决方案将被 视作正确答案 。


示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZlnQNpeZLmw6QIfeLWyMJFzb5GRjaU8PvOc7s)

输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at ''8''

解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。

从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
- 请注意相交节点的值不为 1，因为在链表 A 和链表 B 之中值为 1 的节点 (A 中第二个节点和 B 中第三个节点) 是不同的节点。换句话说，它们在内存中指向两个不同的位置，而链表 A 和链表 B 中值为 8 的节点 (A 中第三个节点，B 中第四个节点) 在内存中指向相同的位置。

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZh4QGDlS8MDkTyov4Yj5CImHLr3g2qzsctPRA)

输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：No intersection

解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。

由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。

这两个链表不相交，因此返回 null 。


## 解法
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getIntersectionNode(headA, headB *ListNode) *ListNode {
    //从两个链表的表头开始遍历
    pA, pB := headA, headB
    for pA != pB {
        if pA != nil {
            pA = pA.Next
        } else {
            //pA为nil说明A遍历完了，遍历B
            pA = headB
        }
        if pB != nil {
            pB = pB.Next
        } else {
            //pB为nil说明A遍历完了，遍历A
            pB = headA
        }
    }
    return pA
}
```
 ', true, '2026-01-02 22:59:54.528', '2026-01-04 21:33:09.91');
INSERT INTO public."Note" VALUES (28, 'detectCycle', 'hot100-环形链表I和II', '### hot100——环形链表I和II

给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改 链表。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZfuNEcV34PfogMh21Vi6rW9OT7ekHNSDAvCmY)

输入：head = [3,2,0,-4], pos = 1

输出：返回索引为 1 的链表节点

解释：链表中有一个环，其尾部连接到第二个节点。

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZr5JlNiOdGw8VWsE7kQ2NxuBm0gatvDHTFIUM)

输入：head = [1,2], pos = 0

输出：返回索引为 0 的链表节点

解释：链表中有一个环，其尾部连接到第一个节点。

示例 3：

![image.png](https://utfs.io/f/51vRr4GGrTuZtwpqI6anEHNfJA0X2Rc1TKm8jbwygMudYFOG)

输入：head = [1], pos = -1

输出：返回 null

解释：链表中没有环。

提示：

链表中节点的数目范围在范围 [0, 104] 内

-105 <= Node.val <= 105

pos 的值为 -1 或者链表中的一个有效索引

## 解
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

// detectCycle 检测链表中是否存在环，若存在则返回环的入口节点，否则返回 nil
func detectCycle(head *ListNode) *ListNode {
    // 初始化快慢指针，都从链表头开始
    slow, fast := head, head

    // 使用快慢指针检测是否存在环
    // 循环条件：fast 和 fast.Next 都不能为 nil，确保 fast.Next.Next 安全访问
    for fast != nil && fast.Next != nil {
        slow = slow.Next           // 慢指针每次走 1 步
        fast = fast.Next.Next      // 快指针每次走 2 步

        // 如果快慢指针相遇，说明链表中存在环
        if slow == fast {
            // 此时 slow（或 fast）是环内的某个相遇点
            // 根据 Floyd 算法第二阶段：找环入口
            
            // 将 curr 指针重置到链表头部
            curr := head
            
            // curr 从头开始，slow 从相遇点开始，两者以相同速度（每次1步）前进
            // 它们第一次相遇的位置就是环的入口节点
            for curr != slow {
                curr = curr.Next
                slow = slow.Next
            }
            
            // 返回环的入口节点
            return curr
        }
    }

    // 如果循环正常结束（fast 走到 nil），说明链表无环
    return nil
}
```
', true, '2026-01-05 16:57:55.481', '2026-01-05 16:57:55.481');
INSERT INTO public."Note" VALUES (29, 'mergeTwoLists', 'hot100-合并两个有序链表', '### hot100——合并两个有序链表

将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZED6qddkHjYv8qwiQCtsxp15oPncmDhJg6r9U)

输入：l1 = [1,2,4], l2 = [1,3,4]

输出：[1,1,2,3,4,4]

示例 2：

输入：l1 = [], l2 = []

输出：[]

示例 3：

输入：l1 = [], l2 = [0]

输出：[0]
 

提示：

两个链表的节点数目范围是 [0, 50]

-100 <= Node.val <= 100

l1 和 l2 均按 非递减顺序 排列


## 解
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    // 创建一个虚拟头节点（dummy node），仅用于简化链表构建逻辑
    // 它的值不重要，真正的结果从它的下一个节点开始
    dummy := &ListNode{}
    
    // curr 指向当前结果链表的最后一个节点，初始时指向 dummy
    curr := dummy

    // 当两个链表都还有剩余节点时，持续比较并合并
    for list1 != nil && list2 != nil {
        if list1.Val <= list2.Val {
            // list1 当前节点值更小，将其接到结果链表末尾
            curr.Next = list1
            // list1 指针向后移动一位，指向下一个待处理节点
            list1 = list1.Next
        } else {
            // list2 当前节点值更小，将其接到结果链表末尾
            curr.Next = list2
            // list2 指针向后移动一位，指向下一个待处理节点
            list2 = list2.Next
        }
        // curr 指针向后移动一位，始终指向结果链表的新尾部
        curr = curr.Next
    }

    // 此时至少有一个链表已经遍历完
    // 由于输入链表本身是有序的，可直接将剩余部分拼接到结果末尾

    if list1 != nil {
        // list1 还有剩余，全部接上（无需逐个处理）
        curr.Next = list1
    }
    if list2 != nil {
        // list2 还有剩余，全部接上
        curr.Next = list2
    }

    // 返回 dummy 的下一个节点，即合并后链表的真实头节点
    // （dummy 本身是辅助节点，不应包含在结果中）
    return dummy.Next
}
```', true, '2026-01-06 00:04:57.375', '2026-01-06 00:04:57.375');
INSERT INTO public."Note" VALUES (30, 'addTwoNumbers', 'hot100-两数相加', '### hot100——两数相加

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

![image.png](https://utfs.io/f/51vRr4GGrTuZPrESZnXZvgfSL1NcbkXqMxolwsHURumY2aCE)
输入：l1 = [2,4,3], l2 = [5,6,4]

输出：[7,0,8]

解释：342 + 465 = 807.

示例 2：

输入：l1 = [0], l2 = [0]

输出：[0]

示例 3：

输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]

输出：[8,9,9,9,0,0,0,1]
 

提示：

每个链表中的节点数在范围 [1, 100] 内

0 <= Node.val <= 9

题目数据保证列表表示的数字不含前导零



## 解法
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{} // 虚拟头节点，方便操作
    cur := dummy
    carry := 0 // 进位

    // 只要还有节点或进位，就继续
    for l1 != nil || l2 != nil || carry != 0 {
        sum := carry

        if l1 != nil {
            sum += l1.Val
            l1 = l1.Next
        }
        if l2 != nil {
            sum += l2.Val
            l2 = l2.Next
        }

        carry = sum / 10          // 计算进位（0 或 1）
        digit := sum % 10         // 当前位的数字

        cur.Next = &ListNode{Val: digit}
        cur = cur.Next
    }

    return dummy.Next
}
```', true, '2026-01-16 00:22:15.203', '2026-01-18 00:12:31.129');
INSERT INTO public."Note" VALUES (31, 'removeNthFromEnd', 'hot100-删除链表的倒数第N个节点', '### hot100——删除链表的倒数第N个节点

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZhwgoi8S8MDkTyov4Yj5CImHLr3g2qzsctPRA)

输入：head = [1,2,3,4,5], n = 2

输出：[1,2,3,5]

示例 2：

输入：head = [1], n = 1

输出：[]

示例 3：

输入：head = [1,2], n = 1

输出：[1]
 

提示：

链表中结点的数目为 sz

1 <= sz <= 30

0 <= Node.val <= 100

1 <= n <= sz



## 解法
```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    // 创建虚拟头节点（dummy node），其 Next 指向原链表头。
    dummy := &ListNode{Next: head}
    slow, fast := dummy, dummy
    //让快指针先走n步
    for i := 0; i < n; i++ {
        fast = fast.Next
    }
    
    for fast.Next != nil {
        fast = fast.Next
        slow = slow.Next
    }
    //快指针走到表尾时，慢指针所在的下一个节点位置就是要删除的节点
    slow.Next = slow.Next.Next
    return dummy.Next
}
```

', true, '2026-01-18 23:52:00.916', '2026-01-18 23:52:00.916');
INSERT INTO public."Note" VALUES (33, 'sortList', 'hot100-排序链表', '### hot100——排序链表

给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZ2Z5NPOSwmrGVfkscFCz6ah2JNDb7SpBQyjRY)

输入：head = [4,2,1,3]

输出：[1,2,3,4]

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZ3PT0Zg5c7LEm5zKON19l6ghZeJAvYUCdyujW)

输入：head = [-1,5,3,4,0]

输出：[-1,0,3,4,5]

示例 3：

输入：head = []

输出：[]
 

提示：

链表中节点的数目在范围 [0, 5 * $10^4$] 内

-$10^5$ <= Node.val <= $10^5$

', true, '2026-02-11 23:47:22.548', '2026-02-11 23:55:44.046');
INSERT INTO public."Note" VALUES (37, 'isSymmetric', 'hot100-对称二叉树', '### hot100——对称二叉树

给你一个二叉树的根节点 root ， 检查它是否轴对称。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZLgdf0btpV6Z5r4hTU3IfBDtF9OMmWuvC1RAw)

输入：root = [1,2,2,3,4,4,3]

输出：true

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZtwRar59nEHNfJA0X2Rc1TKm8jbwygMudYFOG)

输入：root = [1,2,2,null,3,null,3]

输出：false
 

提示：

树中节点数目在范围 [1, 1000] 内

-100 <= Node.val <= 100


### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

func isSymmetric(root *TreeNode) bool {
    if root == nil {
        return true
    }
    return check(root.Left, root.Right)
}

// 辅助函数：判断两个子树是否镜像对称
func check(p, q *TreeNode) bool {
    // 两个都为空：对称
    if p == nil && q == nil {
        return true
    }
    // 一个为空一个不为空：不对称
    if p == nil || q == nil {
        return false
    }
    // 值不相等：不对称
    if p.Val != q.Val {
        return false
    }
    // 递归检查：p的左子树与q的右子树，p的右子树与q的左子树
    return check(p.Left, q.Right) && check(p.Right, q.Left)
}
```
', true, '2026-02-14 17:50:03.565', '2026-02-14 17:50:03.565');
INSERT INTO public."Note" VALUES (38, 'diameterOfBinaryTree', 'hot100-二叉树的直径', '### hot100——二叉树的直径

给你一棵二叉树的根节点，返回该树的 直径 。

二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。

两节点之间路径的 长度 由它们之间边数表示。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZBLTbu8iNLc9IS5niJsHb13OjzxWmK2ZuPd8Y)

输入：root = [1,2,3,4,5]

输出：3

解释：3 ，取路径 [4,2,1,3] 或 [5,2,1,3] 的长度。

示例 2：

输入：root = [1,2]

输出：1
 

提示：

树中节点数目在范围 [1, $10^4$] 内

-100 <= Node.val <= 100


### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

func diameterOfBinaryTree(root *TreeNode) int {
    maxDiameter := 0
    depth(root, &maxDiameter)
    return maxDiameter
}

// 返回以 node 为根的子树的最大深度，并更新最大直径
func depth(node *TreeNode, maxDiameter *int) int {
    if node == nil {
        return 0
    }
    leftDepth := depth(node.Left, maxDiameter)
    rightDepth := depth(node.Right, maxDiameter)

    // 当前节点作为路径中间点时，路径长度为左深度+右深度
    if leftDepth+rightDepth > *maxDiameter {
        *maxDiameter = leftDepth + rightDepth
    }

    // 返回当前节点的深度（用于父节点计算）
    if leftDepth > rightDepth {
        return leftDepth + 1
    }
    return rightDepth + 1
}
```', true, '2026-02-14 18:25:33.76', '2026-02-14 18:25:33.76');
INSERT INTO public."Note" VALUES (39, 'levelOrder', 'hot100-二叉树的层序遍历', '### hot100——二叉树的层序遍历

给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZayEF3AG7oIGCeKNfyb6cDnqwzLMaAYp2iTk3)
输入：root = [3,9,20,null,null,15,7]

输出：[[3],[9,20],[15,7]]

示例 2：

输入：root = [1]

输出：[[1]]

示例 3：

输入：root = []

输出：[]
 

提示：

树中节点数目在范围 [0, 2000] 内

-1000 <= Node.val <= 1000



### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

func levelOrder(root *TreeNode) [][]int {
    if root == nil {
        return [][]int{}
    }
    result := make([][]int, 0)
    queue := []*TreeNode{root} // 初始化队列，加入根节点

    for len(queue) > 0 {
        levelSize := len(queue) // 当前层的节点数
        level := make([]int, 0, levelSize)

        for i := 0; i < levelSize; i++ {
            // 出队
            node := queue[0]
            queue = queue[1:]

            // 记录当前节点值
            level = append(level, node.Val)

            // 将左右子节点加入队列（下一层）
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }

        result = append(result, level)
    }

    return result
}
```', true, '2026-02-15 15:07:41.909', '2026-02-15 15:07:41.909');
INSERT INTO public."Note" VALUES (40, 'mergeTrees', 'hot100-合并二叉树', '### hot100——合并二叉树

给你两棵二叉树： root1 和 root2 。

想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，不为 null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

注意: 合并过程必须从两个树的根节点开始。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZ4wEva5ZxmQOTivh8VwpjANybEuFedfHKgML2)

输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]

输出：[3,4,5,5,4,null,7]

示例 2：

输入：root1 = [1], root2 = [1,2]

输出：[2,2]
 

提示：

两棵树中的节点数目在范围 [0, 2000] 内

-$10^4$ <= Node.val <= $10^4$



### 解法
```go
 /**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

func mergeTrees(root1 *TreeNode, root2 *TreeNode) *TreeNode {
    if root1 == nil {
        return root2
    }
    if root2 == nil {
        return root1
    }
    // 两者都非空，以 root1 为基合并（也可以新建节点）
    root1.Val += root2.Val
    root1.Left = mergeTrees(root1.Left, root2.Left)
    root1.Right = mergeTrees(root1.Right, root2.Right)
    return root1
}
```', true, '2026-02-16 14:54:27.005', '2026-02-16 14:54:27.005');
INSERT INTO public."Note" VALUES (41, 'numTrees', 'hot100-不同的二叉搜索树', '### hot100——不同的二叉搜索树

给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。

示例 1：
![image.png](https://utfs.io/f/51vRr4GGrTuZf9m0Kg34PfogMh21Vi6rW9OT7ekHNSDAvCmY)
输入：n = 3

输出：5

示例 2：

输入：n = 1

输出：1
 

提示：

1 <= n <= 19


### 解法
```go
func numTrees(n int) int {
    // dp[i] 表示由 i 个节点（值从 1 到 i）能构成的不同二叉搜索树的个数
    dp := make([]int, n+1) // 创建长度为 n+1 的切片，索引 0..n

    // 基础情况：空树和只有一个节点的树都只有 1 种
    dp[0], dp[1] = 1, 1

    // 从 2 个节点开始，逐步计算到 n 个节点
    for i := 2; i <= n; i++ {
        // 枚举根节点的值 j，j 可以从 1 到 i
        for j := 1; j <= i; j++ {
            // 左子树有 j-1 个节点，右子树有 i-j 个节点
            // 左右子树的形态数相乘，得到以 j 为根的总数
            // 累加到 dp[i] 上，覆盖所有可能的根节点
            dp[i] += dp[j-1] * dp[i-j]
        }
    }

    // 返回 n 个节点的二叉搜索树总数
    return dp[n]
}
```', true, '2026-02-16 21:31:30.218', '2026-02-16 21:31:30.218');
INSERT INTO public."Note" VALUES (42, 'isValidBST', 'hot100-验证搜索二叉树', '### hot100——验证二叉搜索树

给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。

有效 二叉搜索树定义如下：

节点的左子树只包含 严格小于 当前节点的数。
节点的右子树只包含 严格大于 当前节点的数。
所有左子树和右子树自身必须也是二叉搜索树。
 

示例 1：
![image.png](https://utfs.io/f/51vRr4GGrTuZURv9Rf6hdiZApQ6Yy9lxuzOk4g3KLCov1Hrb)

输入：root = [2,1,3]

输出：true

示例 2：
![image.png](https://utfs.io/f/51vRr4GGrTuZGgPYDYubAV4loP3jvGD8wnhUYr9dFqiC06kx)

输入：root = [5,1,4,null,null,3,6]

输出：false

解释：根节点的值是 5 ，但是右子节点的值是 4 。
 

提示：

树中节点数目范围在[1, $10^4$] 内

-$2^{31}$ <= Node.val <= $2^{31}$ - 1



### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
import "math"

func isValidBST(root *TreeNode) bool {
    return validate(root, math.MinInt64, math.MaxInt64)
}

func validate(node *TreeNode, min, max int) bool {
    if node == nil {
        return true
    }
    // 当前节点值必须在 (min, max) 范围内
    if node.Val <= min || node.Val >= max {
        return false
    }
    // 左子树所有节点值必须小于当前节点值，所以最大值更新为 node.Val
    // 右子树所有节点值必须大于当前节点值，所以最小值更新为 node.Val
    return validate(node.Left, min, node.Val) && validate(node.Right, node.Val, max)
}
```', true, '2026-02-17 13:40:51.849', '2026-02-17 13:40:51.849');
INSERT INTO public."Note" VALUES (43, 'flatten', 'hot100-二叉树展开为链表', '### hot100——二叉树展开为链表

给你二叉树的根结点 root ，请你将它展开为一个单链表：

展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。

展开后的单链表应该与二叉树 先序遍历 顺序相同。
 
示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZ8F2nI3Pvo3ZulaEHMqPW6IJtpsYVKQLChmGi)

输入：root = [1,2,5,3,4,null,6]

输出：[1,null,2,null,3,null,4,null,5,null,6]

示例 2：

输入：root = []

输出：[]

示例 3：

输入：root = [0]

输出：[0]
 

提示：

树中结点数在范围 [0, 2000] 内

-100 <= Node.val <= 100



### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func flatten(root *TreeNode) {
    curr := root
    for curr != nil {
        if curr.Left != nil {
            // 寻找左子树的最右节点
            pre := curr.Left
            for pre.Right != nil {
                pre = pre.Right
            }
            // 将原右子树接到最右节点的右边
            pre.Right = curr.Right
            // 将左子树移到右边
            curr.Right = curr.Left
            curr.Left = nil
        }
        // 继续处理下一个节点
        curr = curr.Right
    }
}
```
', true, '2026-02-17 15:09:19.155', '2026-02-17 15:10:11.449');
INSERT INTO public."Note" VALUES (44, 'buildTree', 'hot100-从前序与中序遍历序列构造二叉树', '### hot100——从前序与中序遍历序列构造二叉树

给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。

示例 1:

![image.png](https://utfs.io/f/51vRr4GGrTuZbFWxoZHCF8etEaG7dwNH2bvjZkcpQI51RrPY)
输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]

输出: [3,9,20,null,null,15,7]

示例 2:

输入: preorder = [-1], inorder = [-1]

输出: [-1]
 

提示:

1 <= preorder.length <= 3000

inorder.length == preorder.length

-3000 <= preorder[i], inorder[i] <= 3000

preorder 和 inorder 均 无重复 元素

inorder 均出现在 preorder

preorder 保证 为二叉树的前序遍历序列

inorder 保证 为二叉树的中序遍历序列



### 解法
```go
func buildTree(preorder []int, inorder []int) *TreeNode {
    if len(preorder) == 0 {
        return nil
    }
    // 前序第一个元素是根节点
    rootVal := preorder[0]
    root := &TreeNode{Val: rootVal}

    // 在中序中找到根节点位置
    var index int
    for i, val := range inorder {
        if val == rootVal {
            index = i
            break
        }
    }

    // 切分出左子树和右子树的遍历序列
    leftInorder := inorder[:index]          // 左子树中序
    rightInorder := inorder[index+1:]       // 右子树中序
    leftPreorder := preorder[1 : 1+len(leftInorder)] // 左子树前序（长度与左子树中序相同）
    rightPreorder := preorder[1+len(leftInorder):]   // 右子树前序

    // 递归构建左右子树
    root.Left = buildTree(leftPreorder, leftInorder)
    root.Right = buildTree(rightPreorder, rightInorder)

    return root
}
```', true, '2026-02-17 22:06:15.107', '2026-02-17 22:06:15.107');
INSERT INTO public."Note" VALUES (46, 'lowestCommonAncestor', 'hot100-二叉树的最近公共祖先', '### hot100——二叉树的最近公共祖先
给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZiroDQJgnJ9UldgIszDY23pSrcTfHAaexOMC7)
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1

输出：3

解释：节点 5 和节点 1 的最近公共祖先是节点 3 。

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZXwoN00aJEvQo9nBKjft4rH0gYep7zIPhCGyS)
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4

输出：5

解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。

示例 3：

输入：root = [1,2], p = 1, q = 2

输出：1
 

提示：

树中节点数目在范围 [2, $10^5$] 内。

-$10^9$ <= Node.val <= $10^9$

所有 Node.val 互不相同 。

p != q

p 和 q 均存在于给定的二叉树中。



### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    // 如果当前节点为空，或者等于 p 或 q，直接返回
    if root == nil || root == p || root == q {
        return root
    }
    // 在左子树中查找 p 和 q
    left := lowestCommonAncestor(root.Left, p, q)
    // 在右子树中查找 p 和 q
    right := lowestCommonAncestor(root.Right, p, q)

    // 如果左右子树都找到了，说明当前节点是最近公共祖先
    if left != nil && right != nil {
        return root
    }
    // 否则返回非空的那一侧（如果都为空，则返回 nil）
    if left != nil {
        return left
    }
    return right
}
```
', true, '2026-02-18 21:38:50.282', '2026-02-18 21:38:50.282');
INSERT INTO public."Note" VALUES (45, 'pathSum', 'hot100-路径总和III', '### hot100——路径总和III
给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。

路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZq5oT00DAbVZ3x0L6mlKYytGih5MPsozNBFkc)
输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8

输出：3

解释：和等于 8 的路径有 3 条，如图所示。

示例 2：

输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22

输出：3
 

提示:

二叉树的节点个数的范围是 [0,1000]

-$10^9$ <= Node.val <= $10^9$ 

-1000 <= targetSum <= 1000 


### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

// pathSum 返回二叉树中路径和等于 targetSum 的路径总数（路径方向向下，不必须从根开始）
func pathSum(root *TreeNode, targetSum int) int {
    // 前缀和映射：从根到当前节点的路径和 -> 出现次数
    // 初始化前缀和为 0 出现一次，表示空路径
    prefix := make(map[int]int)
    prefix[0] = 1
    // 开始深度优先搜索
    return dfs(root, 0, targetSum, prefix)
}

// dfs 递归遍历二叉树，返回以 node 为根的子树中所有符合条件的路径总数
// curSum 是从根到当前节点的路径和（不含当前节点，调用时传入父节点的 curSum）
// targetSum 是目标值
// prefix 是前缀和计数映射（会随着递归动态更新）
func dfs(node *TreeNode, currSum int, targetSum int, prefix map[int]int) int {
    if node == nil {
        return 0
    }

    // 更新当前路径和（加上当前节点值）
    currSum += node.Val

    // 核心：以当前节点结尾的路径中，有多少条路径和为 targetSum
    // 即之前出现过的前缀和为 currSum - targetSum 的次数
    result := prefix[currSum-targetSum]

    // 将当前路径和加入前缀和计数，供子树使用
    prefix[currSum]++

    // 递归处理左右子树，并将它们的结果累加到 result 上
    result += dfs(node.Left, currSum, targetSum, prefix)
    result += dfs(node.Right, currSum, targetSum, prefix)

    // 回溯：当前节点处理完毕，返回父节点之前，移除当前路径和的计数
    // 避免影响兄弟子树或父节点的其他分支
    prefix[currSum]--

    // 返回当前子树中所有符合条件的路径总数
    return result
}
```', true, '2026-02-18 16:28:40.355', '2026-02-18 22:31:59.647');
INSERT INTO public."Note" VALUES (47, 'maxPathSum', 'hot100-二叉树中的最大路径和', '### hot100——二叉树中的最大路径和
二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。

路径和 是路径中各节点值的总和。

给你一个二叉树的根节点 root ，返回其 最大路径和 。

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZrLLpTGPOdGw8VWsE7kQ2NxuBm0gatvDHTFIU)

输入：root = [1,2,3]

输出：6

解释：最优路径是 2 -> 1 -> 3 ，路径和为 2 + 1 + 3 = 6

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZERCJ1jkHjYv8qwiQCtsxp15oPncmDhJg6r9U)
输入：root = [-10,9,20,null,null,15,7]

输出：42

解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42
 

提示：

树中节点数目范围是 [1, 3 * $10^4$]

-1000 <= Node.val <= 1000



### 解法
```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
import "math"
func maxPathSum(root *TreeNode) int {
    maxSum := math.MinInt64
    dfs(root, &maxSum)
    return maxSum
}

// 返回以 node 为起点的最大向下贡献，并通过指针更新全局最大路径和
func dfs(node *TreeNode, maxSum *int) int {
    if node == nil {
        return 0
    }
    leftGain := max(dfs(node.Left, maxSum), 0)
    rightGain := max(dfs(node.Right, maxSum), 0)

    // 更新全局最大路径和：经过当前节点的路径
    currentPathSum := node.Val + leftGain + rightGain
    if currentPathSum > *maxSum {
        *maxSum = currentPathSum
    }

    // 返回当前节点的最大贡献
    return node.Val + max(leftGain, rightGain)
}

```', true, '2026-02-18 22:26:57.788', '2026-02-18 22:26:57.788');
INSERT INTO public."Note" VALUES (48, 'LRU', 'hot100-LRU缓存', '### hot100——LRU缓存
请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
实现 LRUCache 类：

LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存

int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。

void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。

函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。

示例：

输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]

[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

输出

[null, null, null, 1, null, -1, null, -1, 3, 4]

解释

LRUCache lRUCache = new LRUCache(2);

lRUCache.put(1, 1); // 缓存是 {1=1}

lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}

lRUCache.get(1);    // 返回 1

lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}

lRUCache.get(2);    // 返回 -1 (未找到)

lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}

lRUCache.get(1);    // 返回 -1 (未找到)

lRUCache.get(3);    // 返回 3

lRUCache.get(4);    // 返回 4
 

提示：

1 <= capacity <= 3000

0 <= key <= 10000

0 <= value <= $10^5$

最多调用 2 * $10^5$ 次 get 和 put



### 解法
```go
package main

import "container/list"

// LRUCache 结构体
type LRUCache struct {
    capacity int                // 最大容量
    list     *list.List         // 双向链表，存储 *entry
    cache    map[int]*list.Element // 哈希表，key 映射到链表节点
}

// entry 代表链表中的一个节点，保存 key 和 value
type entry struct {
    key   int
    value int
}

// Constructor 初始化 LRU 缓存
func Constructor(capacity int) LRUCache {
    return LRUCache{
        capacity: capacity,
        list:     list.New(),
        cache:    make(map[int]*list.Element, capacity),
    }
}

// Get 获取 key 对应的值，若不存在返回 -1
func (this *LRUCache) Get(key int) int {
    // 如果 key 存在于哈希表
    if elem, ok := this.cache[key]; ok {
        // 将对应节点移动到链表头部（表示最近使用）
        this.list.MoveToFront(elem)
        // 返回 value
        return elem.Value.(*entry).value
    }
    return -1
}

// Put 插入或更新键值对
func (this *LRUCache) Put(key int, value int) {
    // 如果 key 已存在，更新值并移动到头部
    if elem, ok := this.cache[key]; ok {
        // 移动到头部
        this.list.MoveToFront(elem)
        // 更新值
        elem.Value.(*entry).value = value
        return
    }

    // 如果达到容量上限，需要淘汰最久未使用的节点（链表尾部）
    if this.list.Len() >= this.capacity {
        // 获取链表尾部元素
        backElem := this.list.Back()
        if backElem != nil {
            // 从哈希表中删除该 key
            delete(this.cache, backElem.Value.(*entry).key)
            // 从链表中删除该节点
            this.list.Remove(backElem)
        }
    }

    // 创建新节点，插入链表头部
    newEntry := &entry{key: key, value: value}
    newElem := this.list.PushFront(newEntry)
    // 存入哈希表
    this.cache[key] = newElem
}
```', true, '2026-02-20 22:57:44.016', '2026-02-20 23:00:01.406');
INSERT INTO public."Note" VALUES (72, 'rotateArray', 'hot100-轮转数组', '### hot100——轮转数组

给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。

示例 1:

输入: nums = [1,2,3,4,5,6,7], k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]

示例 2:

输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]
解释: 
向右轮转 1 步: [99,-1,-100,3]
向右轮转 2 步: [3,99,-1,-100]
 

提示：

1 <= nums.length <= $10^5$
-$2^{31}$ <= nums[i] <= $2^{31}$ - 1
0 <= k <= $10^5$


### 解法
```go
func rotate(nums []int, k int)  {
    n := len(nums)
    k = k%n
    //先反转整个数组
    reverse(nums, 0, n-1)
    //再反转前k个
    reverse(nums, 0, k-1)
    //再反转剩余的
    reverse(nums, k, n-1)
}

func reverse(nums []int, left int, right int) {
    for left < right {
        nums[left], nums[right] = nums[right], nums[left]
        left++
        right--
    }
}
```', true, '2026-03-14 16:14:58.075', '2026-03-15 21:07:19.864');
INSERT INTO public."Note" VALUES (49, 'permute', 'hot100-全排列', '### hot100——全排列

给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

示例 1：

输入：nums = [1,2,3]

输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

示例 2：

输入：nums = [0,1]

输出：[[0,1],[1,0]]

示例 3：

输入：nums = [1]

输出：[[1]]
 

提示：

1 <= nums.length <= 6

-10 <= nums[i] <= 10

nums 中的所有整数 互不相同

### 解法
```go
func permute(nums []int) [][]int {
    res := make([][]int, 0)
    n := len(nums)
    used := make([]bool, n)
    path := make([]int, 0, n)
    backtrack(&res, nums, path, used)
    return res
}

// backtrack 是核心递归函数
// 参数：
//   res  - 指向结果集的指针，用于收集完整排列
//   nums - 原始数组（只读）
//   path - 当前已选数字的序列（切片，每次递归传递副本但底层数组共享）
//   used - 标记数组，记录 nums 中每个数字是否已被使用
func backtrack(res *[][]int, nums []int, path []int, used []bool) {
    // 递归终止：path 长度等于原数组长度，说明找到一个完整排列
    if len(path) == len(nums) {
        // 拷贝一份 path 加入结果集，避免后续修改影响已保存的排列
        tmp := make([]int, len(path))
        copy(tmp, path)
        *res = append(*res, tmp)
        return
    }

    // 遍历所有数字，尝试填入当前位置
    for i := 0; i < len(nums); i++ {
        if used[i] {
            continue // 跳过已使用的数字
        }
        // 做选择
        used[i] = true
        path = append(path, nums[i])

        // 递归进入下一层
        backtrack(res, nums, path, used)

        // 撤销选择（回溯）
        path = path[:len(path)-1]
        used[i] = false
    }
}
```', true, '2026-03-07 15:50:28.034', '2026-03-07 15:50:28.034');
INSERT INTO public."Note" VALUES (50, 'subsets', 'hot100-子集', '### hot100——子集

给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。

解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

示例 1：

输入：nums = [1,2,3]

输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

示例 2：

输入：nums = [0]

输出：[[],[0]]
 

提示：

1 <= nums.length <= 10

-10 <= nums[i] <= 10

nums 中的所有元素 互不相同


## 解法
```go
func subsets(nums []int) [][]int {
    res := make([][]int, 0)
    path := make([]int, 0)
    dfs(nums, 0, path, &res)
    return res
}

// dfs 是递归函数
// nums: 原数组
// start: 当前可选的起始下标
// path: 当前已选择的元素切片
// res: 指向结果集的指针
func dfs(nums []int, start int, path []int, res *[][]int) {
    // 将当前路径加入结果（每个节点都是一个子集）
    tmp := make([]int, len(path))
    copy(tmp, path)
    *res = append(*res, tmp)

    // 从 start 开始遍历，避免重复组合
    for i := start; i < len(nums); i++ {
        // 做选择：将 nums[i] 加入 path
        path = append(path, nums[i])
        // 递归，下一轮从 i+1 开始
        dfs(nums, i+1, path, res)
        // 撤销选择
        path = path[:len(path)-1]
    }
}
```', true, '2026-03-07 20:03:02.572', '2026-03-07 20:03:24.739');
INSERT INTO public."Note" VALUES (53, 'generateParenthesis', 'hot100-括号生成', '### hot100——括号生成

数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

示例 1：

输入：n = 3

输出：["((()))","(()())","(())()","()(())","()()()"]

示例 2：

输入：n = 1

输出：["()"]
 

提示：

1 <= n <= 8


### 解法
```go
// generateParenthesis 生成所有有效的括号组合
func generateParenthesis(n int) []string {
    res := make([]string, 0)          // 存放结果集
    backtrack(n, 0, 0, "", &res)       // 从空字符串开始回溯
    return res
}

// backtrack 递归回溯函数
// n:     括号对数
// left:  当前已使用的左括号数量
// right: 当前已使用的右括号数量
// cur:   当前构建的括号字符串
// res:   指向结果集的指针
func backtrack(n int, left int, right int, cur string, res *[]string) {
    // 当字符串长度达到 2*n 时，说明生成了一个完整组合
    if len(cur) == 2*n {
        *res = append(*res, cur)
        return
    }
    // 如果左括号数量小于 n，可以添加一个左括号
    if left < n {
        backtrack(n, left+1, right, cur+"(", res)
    }
    // 如果右括号数量小于左括号数量，可以添加一个右括号（保证有效性）
    if right < left {
        backtrack(n, left, right+1, cur+")", res)
    }
}
```', true, '2026-03-10 00:13:59.546', '2026-03-10 19:10:21.86');
INSERT INTO public."Note" VALUES (54, 'canPartition', 'hot100-分割等和子集', '### hot100——分割等和子集

给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

示例 1：

输入：nums = [1,5,11,5]

输出：true

解释：数组可以分割成 [1, 5, 5] 和 [11] 。

示例 2：

输入：nums = [1,2,3,5]

输出：false

解释：数组不能分割成两个元素和相等的子集。
 

提示：

1 <= nums.length <= 200

1 <= nums[i] <= 100


### 解法
```go
// canPartition 判断是否可以将数组分割成两个和相等的子集
func canPartition(nums []int) bool {
    // 计算总和
    sum := 0
    for _, num := range nums {
        sum += num
    }
    // 如果总和为奇数，不可能平分
    if sum%2 != 0 {
        return false
    }

    target := sum / 2 // 需要凑出的目标值
    dp := make([]bool, target+1) // dp[i] 表示能否选出一些数使它们的和为 i
    dp[0] = true // 不选任何数时和为0

    // 遍历每个数
    for _, num := range nums {
        // 从后往前更新 dp，避免同一个数被重复使用
        for j := target; j >= num; j-- {
            if dp[j-num] {
                dp[j] = true
            }
        }
    }
    return dp[target]
}
```', true, '2026-03-10 19:06:03.281', '2026-03-10 19:10:29.246');
INSERT INTO public."Note" VALUES (51, 'letterCombination', 'hot100-电话号码的字母组合', '### hot100——电话号码的字母组合

给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

![image.png](https://utfs.io/f/51vRr4GGrTuZ3uSUCTh5c7LEm5zKON19l6ghZeJAvYUCdyuj)
 
示例 1：

输入：digits = "23"

输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]

示例 2：

输入：digits = "2"

输出：["a","b","c"]
 

提示：

1 <= digits.length <= 4

digits[i] 是范围 [''2'', ''9''] 的一个数字。


### 解法
```go
// 数字到字母的映射表，全局常量
var phoneMap = map[byte]string{
    ''2'': "abc",
    ''3'': "def",
    ''4'': "ghi",
    ''5'': "jkl",
    ''6'': "mno",
    ''7'': "pqrs",
    ''8'': "tuv",
    ''9'': "wxyz",
}

// letterCombinations 返回所有可能的字母组合
func letterCombinations(digits string) []string {
    if len(digits) == 0 {
        return []string{}
    }
    res := make([]string, 0)
    backtrack(digits, 0, "", &res)
    return res
}

// backtrack 是递归回溯函数
// digits: 输入的数字字符串
// index: 当前处理到的数字位置
// cur: 当前已经构建的字母组合（字符串）
// res: 指向结果集的指针
func backtrack(digits string, index int, cur string, res *[]string) {
    // 递归终止：已经处理完所有数字，将当前组合加入结果集
    if index == len(digits) {
        *res = append(*res, cur)
        return
    }
    // 获取当前数字对应的字母串
    letters := phoneMap[digits[index]]
    // 遍历每个可能的字母
    for i := 0; i < len(letters); i++ {
        // 将当前字母附加到 cur 上，递归处理下一个数字
        // 注意：cur + string(letters[i]) 会产生新字符串，无需显式回溯
        backtrack(digits, index+1, cur+string(letters[i]), res)
    }
    // 没有显式的撤销操作，因为每次递归传递的是新字符串值
}
```', true, '2026-03-07 21:45:48.766', '2026-03-10 19:10:03.696');
INSERT INTO public."Note" VALUES (52, 'combinationSum', 'hot100-组合总和', '### hot100——组合总和

给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。

candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 

对于给定的输入，保证和为 target 的不同组合数少于 150 个。

示例 1：

输入：candidates = [2,3,6,7], target = 7

输出：[[2,2,3],[7]]

解释：
2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。

7 也是一个候选， 7 = 7 。

仅有这两种组合。

示例 2：

输入: candidates = [2,3,5], target = 8

输出: [[2,2,2,2],[2,3,3],[3,5]]

示例 3：

输入: candidates = [2], target = 1

输出: []
 

提示：

1 <= candidates.length <= 30

2 <= candidates[i] <= 40

candidates 的所有元素 互不相同

1 <= target <= 40


### 解法
```go
import "sort"

// combinationSum 返回所有和为 target 的组合，每个数字可重复使用
func combinationSum(candidates []int, target int) [][]int {
    // 先排序，方便剪枝
    sort.Ints(candidates)
    res := make([][]int, 0)
    path := make([]int, 0)
    backtrack(candidates, target, 0, 0, path, &res)
    return res
}

// backtrack 递归回溯函数
// candidates: 候选数组（已排序）
// target: 目标和
// start: 当前可选数字的起始下标（允许重复选取，所以下一轮从 i 开始）
// sum: 当前路径的和
// path: 当前已选择的数字序列
// res: 指向结果集的指针
func backtrack(candidates []int, target int, start int, sum int, path []int, res *[][]int) {
    // 如果当前和等于目标，找到一个有效组合
    if sum == target {
        // 复制一份 path，避免后续修改影响结果
        tmp := make([]int, len(path))
        copy(tmp, path)
        *res = append(*res, tmp)
        return
    }
    // 剪枝：由于数组已排序，如果当前和加上 candidates[i] 已经大于 target，
    // 则后续更大元素也一定大于 target，可以提前结束循环
    for i := start; i < len(candidates) && sum+candidates[i] <= target; i++ {
        // 做选择：将 candidates[i] 加入路径
        path = append(path, candidates[i])
        // 递归：注意下一轮起始下标仍是 i（允许重复使用同一元素）
        backtrack(candidates, target, i, sum+candidates[i], path, res)
        // 撤销选择：回溯
        path = path[:len(path)-1]
    }
}
```', true, '2026-03-09 23:59:49.624', '2026-03-10 19:10:15.1');
INSERT INTO public."Note" VALUES (55, 'isValid', 'hot100-有效的括号', '### hot100——有效的括号

给定一个只包括 ''(''，'')''，''{''，''}''，''[''，'']'' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。

左括号必须以正确的顺序闭合。

每个右括号都有一个对应的相同类型的左括号。
 
示例 1：

输入：s = "()"

输出：true

示例 2：

输入：s = "()[]{}"

输出：true

示例 3：

输入：s = "(]"

输出：false

示例 4：

输入：s = "([])"

输出：true

示例 5：

输入：s = "([)]"

输出：false

 
提示：

1 <= s.length <= $10^4$

s 仅由括号 ''()[]{}'' 组成


### 解法
```go
func isValid(s string) bool {
    // 使用切片模拟栈
    stack := make([]rune, 0)
    // 括号映射：右括号对应的左括号
    pairs := map[rune]rune{
        '')'': ''('',
        '']'': ''['',
        ''}'': ''{'',
    }

    for _, ch := range s {
        // 如果是右括号
        if left, ok := pairs[ch]; ok {
            // 栈顶元素必须匹配对应的左括号
            if len(stack) == 0 || stack[len(stack)-1] != left {
                return false
            }
            // 匹配成功，弹出栈顶
            stack = stack[:len(stack)-1]
        } else {
            // 左括号直接入栈
            stack = append(stack, ch)
        }
    }
    // 栈空说明全部匹配
    return len(stack) == 0
}
```', true, '2026-03-10 19:41:54.56', '2026-03-10 19:41:54.56');
INSERT INTO public."Note" VALUES (73, 'firstMissingPositive', 'hot100-缺失的第一个正数', '### hot100——缺失的第一个正数

给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 
示例 1：

输入：nums = [1,2,0]
输出：3
解释：范围 [1,2] 中的数字都在数组中。

示例 2：

输入：nums = [3,4,-1,1]
输出：2
解释：1 在数组中，但 2 没有。

示例 3：

输入：nums = [7,8,9,11,12]
输出：1
解释：最小的正数 1 没有出现。
 

提示：

1 <= nums.length <= $10^5$

-$2^{31}$ <= nums[i] <= $2^{31}$ - 1


### 解法
```go
func firstMissingPositive(nums []int) int {
    n := len(nums)
    for i := 0; i < n; i++ {
        //  nums[i]和nums[nums[i] - 1]分别代表的是当前元素和它应该在的位置上的元素
        // nums[i]-1是应该在的位置的下标
        // 如[3, 1, 2, 4] 3应该在2的位置上，所以要交换3和2（下标0和2）
        for nums[i] > 0 && nums[i] <= n && nums[i] != nums[nums[i] - 1] {
            nums[i], nums[nums[i] - 1] = nums[nums[i] - 1], nums[i]
        }
    }
    // 全部交换完后，从开头检查是不是都在对应的位置上，第一个满足 nums[i] != i+1 的位置，缺失的正数即为 i+1
    for i := 0; i < n; i++ {
        if nums[i] != i+1 {
            return i+1
        }
    }
    // // 如果所有位置都正确，则缺失的是 n+1
    return nums[n-1]+1
}
```', true, '2026-03-14 22:03:40.265', '2026-03-15 21:06:46.193');
INSERT INTO public."Note" VALUES (56, 'decodeString', 'hot100-字符串解码', '### hot100——字符串解码

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

测试用例保证输出的长度不会超过 $10^5$。

示例 1：

输入：s = "3[a]2[bc]"

输出："aaabcbc"

示例 2：

输入：s = "3[a2[c]]"

输出："accaccacc"

示例 3：

输入：s = "2[abc]3[cd]ef"

输出："abcabccdcdcdef"

示例 4：

输入：s = "abc3[cd]xyz"

输出："abccdcdcdxyz"
 

提示：

1 <= s.length <= 30

s 由小写英文字母、数字和方括号 ''[]'' 组成

s 保证是一个 有效 的输入。

s 中所有整数的取值范围为 [1, 300] 

### 解法
```go
// LeetCode 394. Decode String
// 使用栈模拟解码过程，手动用 for 循环实现字符串重复

func decodeString(s string) string {
    // 两个栈：
    // numStack：保存遇到的数字 k（用于后续重复次数）
    // strStack：保存进入 ''['' 之前的字符串片段（即外层上下文）
    var numStack []int
    var strStack []string

    // currentStr：当前正在构建的字符串（当前层的内容）
    // currentNum：当前正在解析的数字（可能是多位数）
    currentStr := ""
    currentNum := 0

    // 遍历输入字符串的每一个字符
    for _, ch := range s {
        if ch >= ''0'' && ch <= ''9'' {
            // 当前字符是数字，累加到 currentNum
            // 例如 "12"：第一次 currentNum=1，第二次 currentNum=1*10+2=12
            currentNum = currentNum*10 + int(ch-''0'')
        } else if ch == ''['' {
            // 遇到 ''[''，表示要进入一个新的嵌套层级
            // 将当前的数字和字符串压入栈中，保存上下文
            numStack = append(numStack, currentNum)
            strStack = append(strStack, currentStr)

            // 重置状态，准备处理括号内的内容
            currentNum = 0
            currentStr = ""
        } else if ch == '']'' {
            // 遇到 '']''，表示当前嵌套层级结束，需要解码

            // 弹出栈顶：获取重复次数 k 和外层字符串 prevStr
            k := numStack[len(numStack)-1]
            numStack = numStack[:len(numStack)-1]

            prevStr := strStack[len(strStack)-1]
            strStack = strStack[:len(strStack)-1]

            // 手动用 for 循环将 currentStr 重复 k 次
            repeated := ""
            for i := 0; i < k; i++ {
                repeated += currentStr // 每次拼接 currentStr
            }

            // 将重复后的字符串拼接到外层字符串后面，作为新的 currentStr
            currentStr = prevStr + repeated
        } else {
            // 普通字母（a-z 或 A-Z），直接追加到当前字符串
            currentStr += string(ch)
        }
    }

    // 遍历结束后，currentStr 即为最终解码结果
    return currentStr
}
```', true, '2026-03-11 23:51:49.461', '2026-03-11 23:57:49.126');
INSERT INTO public."Note" VALUES (57, 'dailyTemperatures', 'hot100-每日温度', '### hot100——每日温度

给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

示例 1:

输入: temperatures = [73,74,75,71,69,72,76,73]
输出: [1,1,4,2,1,1,0,0]

示例 2:

输入: temperatures = [30,40,50,60]
输出: [1,1,1,0]
示例 3:

输入: temperatures = [30,60,90]
输出: [1,1,0]
 

提示：

1 <= temperatures.length <= $10^5$

30 <= temperatures[i] <= 100



### 解法
```go
func dailyTemperatures(temperatures []int) []int {
    n := len(temperatures)
    res := make([]int, n)      // 结果数组，默认值0(一定要使用make初始化，因为后面直接对res[i]赋值了！)
    stack := make([]int, 0)    // 单调栈，存储索引，栈顶对应的温度最小

    for i := 0; i < n; i++ {
        // 当前温度比栈顶索引对应的温度高，说明找到了下一个更高温度
        for len(stack) > 0 && temperatures[i] > temperatures[stack[len(stack)-1]] {
            top := stack[len(stack)-1]   // 栈顶索引
            stack = stack[:len(stack)-1] // 弹出
            res[top] = i - top            // 计算天数差
        }
        // 将当前索引入栈
        stack = append(stack, i)
    }
    // 栈中剩余的元素没有找到更高温度，res中默认0，无需处理
    return res
}
```', true, '2026-03-12 14:48:44.999', '2026-03-12 14:48:44.999');
INSERT INTO public."Note" VALUES (58, 'largestRectangleArea', 'hot100-柱状图中最大的矩形', '### hot100——柱状图中最大的矩形

给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。

示例 1:

![image.png](https://utfs.io/f/51vRr4GGrTuZ932ziZq1I08MgxPU2Lzyv3ekrXsfdQJEVbm9)
输入：heights = [2,1,5,6,2,3]
输出：10
解释：最大的矩形为图中红色区域，面积为 10

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZv82wqEYzOPlqouCym1r7g2Rc0L86eHJVsETM)
输入： heights = [2,4]
输出： 4
 

提示：

1 <= heights.length <=$10^5$

0 <= heights[i] <= $10^4$


### 解法
```go
func largestRectangleArea(heights []int) int {
    res := 0
    heights = append(heights, 0)  // 在末尾添加高度为0的柱子，确保所有柱子都能被处理
    stack := []int{-1}   // 栈中存放柱子的索引，初始放入 -1 作为左边界哨兵
    for i := 0; i < len(heights); i++ {
        for len(stack) > 1 && heights[i] < heights[stack[len(stack)-1]] {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            // 长度 = heights[top]
            // 宽度 = 右边界 - 左边界 - 1
            res = max(res, heights[top] * (i-stack[len(stack)-1]-1))  
        }
        stack = append(stack, i)
    }
    return res
}

```', true, '2026-03-12 15:33:21.728', '2026-03-12 15:40:29.473');
INSERT INTO public."Note" VALUES (59, 'minWindow', 'hot100-最小覆盖字串', '### hot100——最小覆盖字串

给定两个字符串 s 和 t，长度分别是 m 和 n，返回 s 中的 最短窗口 子串，使得该子串包含 t 中的每一个字符（包括重复字符）。如果没有这样的子串，返回空字符串 ""。

测试用例保证答案唯一。

示例 1：

输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 ''A''、''B'' 和 ''C''。

示例 2：

输入：s = "a", t = "a"
输出："a"
解释：整个字符串 s 是最小覆盖子串。

示例 3:

输入: s = "a", t = "aa"
输出: ""
解释: t 中两个字符 ''a'' 均应包含在 s 的子串中，
因此没有符合条件的子字符串，返回空字符串。
 

提示：

m == s.length

n == t.length

1 <= m, n <= $10^5$

s 和 t 由英文字母组成


### 解法
```go
func minWindow(s string, t string) string {
    minLen := len(s) + 1
    res := ""
    need := make(map[byte]int)
    for i := 0; i < len(t); i++ {
        need[t[i]]++
    }
    needcnt := len(t)
    for l, r := 0, 0; r < len(s); r++ {
        if need[s[r]] > 0 {
            needcnt--
        }
        need[s[r]]--
        for needcnt == 0 {
            if r-l+1 < minLen {
                minLen = r-l+1
                res = s[l:r+1]
            }
            if need[s[l]] == 0 {
                needcnt++
            }
            need[s[l]]++
            l++
        }
    }
    return res
}
```
', true, '2026-03-14 00:22:58.217', '2026-03-14 00:22:58.217');
INSERT INTO public."Note" VALUES (32, 'spiralOrder', 'hot100-螺旋矩阵', '### hot100——螺旋矩阵

给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素

示例 1：

![image.png](https://utfs.io/f/51vRr4GGrTuZy6p9OiMmw4HVf2oUGkFZNdsj8ALYivD0SEtP)

输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]

输出：[1,2,3,6,9,8,7,4,5]

示例 2：

![image.png](https://utfs.io/f/51vRr4GGrTuZ5k4kmBGGrTuZbUz6WM2qQwck3gPJIyXR7i0n)

输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]

输出：[1,2,3,4,8,12,11,10,9,5,6,7]
 

提示：

m == matrix.length

n == matrix[i].length

1 <= m, n <= 10

-100 <= matrix[i][j] <= 100


## 解法
```go
func spiralOrder(matrix [][]int) []int {
    top, bottom := 0, len(matrix)-1
    left, right := 0, len(matrix[0])-1
    result := []int{}
    for left <= right && top <= bottom {
        //左上到右上
        for i := left; i <= right; i++ {
            result = append(result, matrix[top][i])
        }
        top++
        //右上到右下
        for i := top; i <= bottom; i++ {
            result = append(result, matrix[i][right])
        }
        right--
        //右下到左下
        if top <= bottom {
            for i := right; i >= left; i-- {
                result = append(result, matrix[bottom][i])
            }
            bottom--
        }
        
        //左下到左上
        if left <= right {
            for i := bottom; i >= top; i-- {
                result = append(result, matrix[i][left])
            }
            left++
        }
    }
    
    return result
}
```', true, '2026-02-09 23:19:38.269', '2026-03-14 15:24:19.197');


--
-- Data for Name: NoteTag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."NoteTag" VALUES (5, 'react', 'NOTE');
INSERT INTO public."NoteTag" VALUES (8, 'kafka', 'NOTE');
INSERT INTO public."NoteTag" VALUES (6, 'snippet', 'NOTE');
INSERT INTO public."NoteTag" VALUES (7, 'go', 'NOTE');
INSERT INTO public."NoteTag" VALUES (10, 'ops', 'NOTE');
INSERT INTO public."NoteTag" VALUES (11, '算法', 'NOTE');


--
-- Data for Name: _BlogToBlogTag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."_BlogToBlogTag" VALUES (7, 5);
INSERT INTO public."_BlogToBlogTag" VALUES (7, 8);
INSERT INTO public."_BlogToBlogTag" VALUES (7, 11);
INSERT INTO public."_BlogToBlogTag" VALUES (9, 7);
INSERT INTO public."_BlogToBlogTag" VALUES (10, 8);
INSERT INTO public."_BlogToBlogTag" VALUES (10, 10);
INSERT INTO public."_BlogToBlogTag" VALUES (8, 12);


--
-- Data for Name: _NoteToNoteTag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."_NoteToNoteTag" VALUES (55, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (56, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (57, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (58, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (6, 6);
INSERT INTO public."_NoteToNoteTag" VALUES (6, 7);
INSERT INTO public."_NoteToNoteTag" VALUES (7, 5);
INSERT INTO public."_NoteToNoteTag" VALUES (7, 6);
INSERT INTO public."_NoteToNoteTag" VALUES (8, 8);
INSERT INTO public."_NoteToNoteTag" VALUES (8, 10);
INSERT INTO public."_NoteToNoteTag" VALUES (59, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (32, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (73, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (72, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (11, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (9, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (10, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (12, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (13, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (14, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (15, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (17, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (18, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (19, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (20, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (21, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (22, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (16, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (23, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (24, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (26, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (25, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (27, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (28, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (29, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (30, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (31, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (33, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (34, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (35, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (36, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (37, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (38, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (39, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (40, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (41, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (42, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (43, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (44, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (46, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (47, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (45, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (48, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (49, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (50, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (51, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (52, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (53, 11);
INSERT INTO public."_NoteToNoteTag" VALUES (54, 11);


--
-- Name: BlogTag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BlogTag_id_seq"', 13, true);


--
-- Name: Blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Blog_id_seq"', 10, true);


--
-- Name: Echo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Echo_id_seq"', 8, true);


--
-- Name: NoteTag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."NoteTag_id_seq"', 11, true);


--
-- Name: Note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Note_id_seq"', 73, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Hf50CFV3yKqROluf3D8VB66u4iw9nqPXtQU2HE0SI9ND326YElwonfbSSkhV9EN

