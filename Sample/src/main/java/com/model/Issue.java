package com.model;
 

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Table(
	    indexes = {
	        @Index(name = "idx_issue_status", columnList = "status"),
	        @Index(name = "idx_issue_assigned_to", columnList = "assigned_to"),
	        @Index(name = "idx_issue_status_user", columnList = "status, assigned_to"),
	        @Index(name = "idx_issue_status_updated", columnList = "status, updated_at")
	    }
	)
@Setter @Getter
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String status;
    
    
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Comment> comments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

	 
}