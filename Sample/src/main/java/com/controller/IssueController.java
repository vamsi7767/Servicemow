package com.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.model.Issue;
import com.service.IssueService;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin
public class IssueController {

    @Autowired
    private IssueService issueService;

    // ✅ Create Issue
    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        return issueService.createIssue(issue);
    }
//
//    // ✅ Get All Issues
//    @GetMapping
//    public List<Issue> getAll() {
//        return issueService.getAll();
//    }

    // ✅ Get By ID
    @GetMapping("/{id}")
    public Issue getById(@PathVariable Long id) {
        return issueService.getById(id);
    }

    // ✅ Update Issue
    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable Long id,
                             @RequestBody Issue issue) {
        return issueService.updateIssue(id, issue);
    }

    // 🔥 Update Status (Main Feature)
    @PutMapping("/{id}/status")
    public Issue updateStatus(@PathVariable Long id,
                              @RequestParam String status,
                              @RequestParam Long userId) {
        return issueService.updateStatus(id, status.toUpperCase(), userId);
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public String deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return "Issue deleted successfully";
    }

    @GetMapping("/status/{status}")
    public List<Issue> getByStatus(@PathVariable String status) {
        return issueService.getByStatus(status);
    }

    // 🔥 Get Issues Assigned To User (Real Feature)
    @GetMapping("/assigned/{userId}")
    public List<Issue> getByAssignedUser(@PathVariable Long userId) {
        return issueService.getByAssignedUser(userId);
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Object[] counts = issueService.getOverallStats();

        Map<String, Object> result = new HashMap<>();
        result.put("open", counts[0]);
        result.put("closed", counts[1]);
        result.put("inProgress", counts[2]);
        result.put("total", counts[3]);
        return result;
    }


    @GetMapping("/stats-per-user")
    public List<Map<String, Object>> getStatsPerUser() {
        List<Object[]> rows = issueService.getStatsPerUser();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("email", row[1]);
            map.put("open", row[2]);
            map.put("closed", row[3]);
            map.put("inProgress", row[4]);
            map.put("total", row[5]);
            result.add(map);
        }
        return result;
    }
    
    @GetMapping("/filter")
    public List<Issue> getByStatusAndUser(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId) {

        if (status != null && userId != null) {
            return issueService.getByStatusAndUser(status, userId);
        } else if (status != null) {
            return issueService.getByStatus(status);
        } else if (userId != null) {
            return issueService.getByAssignedUser(userId);
        } else {
            return issueService.getAll();
        }
    }

    
    @GetMapping("/search")
    public List<Issue> searchIssues(@RequestParam String keyword) {
        return issueService.search(keyword);
    }
    
    @GetMapping("/report")
    public Map<String, Object> getReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("weekClosed", issueService.getClosedInLastWeek());
        report.put("monthClosed", issueService.getClosedInLastMonth());
        report.put("yearClosed", issueService.getClosedInLastYear());
        report.put("olderThan30Days", issueService.getOlderThan30Days());

        // ✅ Add lists of issues
        report.put("weekClosedIssues", issueService.getClosedIssuesSince(LocalDateTime.now().minusDays(7)));
        report.put("monthClosedIssues", issueService.getClosedIssuesSince(LocalDateTime.now().minusDays(30)));
        report.put("yearClosedIssues", issueService.getClosedIssuesSince(LocalDateTime.now().minusYears(1)));

        return report;
    }

    
    @GetMapping
    public Page<Issue> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return issueService.getAll(page, size);
    }
    

}