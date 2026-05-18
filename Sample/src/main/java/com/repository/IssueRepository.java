package com.repository;
 import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long> {

	List<Issue> findByStatusIgnoreCase(String status);

	List<Issue> findByAssignedToId(Long userId);
	
	List<Issue> findByStatusIgnoreCaseAndAssignedToId(String status, Long userId);


	@Query(value = "SELECT u.name, u.email, " + "SUM(CASE WHEN s.status = 'OPEN' THEN 1 ELSE 0 END) AS open_count, "
			+ "SUM(CASE WHEN s.status = 'CLOSED' THEN 1 ELSE 0 END) AS closed_count, "
			+ "SUM(CASE WHEN s.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_count, "
			+ "COUNT(*) AS total_count " + "FROM users u " + "JOIN issue s ON u.id = s.created_by "
			+ "GROUP BY u.name, u.email", nativeQuery = true)

	List<Object[]> getIssueCountsPerUser();

	@Query(value = "SELECT " + "SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) AS open_count, "
			+ "SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) AS closed_count, "
			+ "SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_count, "
			+ "COUNT(*) AS total_count " + "FROM issue", nativeQuery = true)
	List<Object[]> getIssueCounts();
	
	@Query("SELECT i FROM Issue i LEFT JOIN i.comments c " +
		       "WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
		       "   OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
		       "   OR LOWER(c.message) LIKE LOWER(CONCAT('%', :keyword, '%'))")
		List<Issue> searchIssues(@Param("keyword") String keyword);

	
	@Query("SELECT COUNT(i) FROM Issue i WHERE i.status = 'CLOSED' AND i.updatedAt >= :start")
	long countClosedSince(@Param("start") LocalDateTime start);

	@Query("SELECT i FROM Issue i WHERE i.status <> 'CLOSED' AND i.createdAt <= :threshold")
	List<Issue> findOlderThan(@Param("threshold") LocalDateTime threshold);

	List<Issue> findByStatusAndUpdatedAtAfter(String string, LocalDateTime start);

	Page<Issue> findAll(Pageable pageable);
}
