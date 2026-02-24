import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function SupportManagement() {
  const { supportTickets, respondToTicket, updateTicketStatus } = useContext(AuthContext);
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredTickets = filterStatus === "All" 
    ? supportTickets 
    : supportTickets.filter(t => t.status === filterStatus);

  const handleRespond = (ticketId) => {
    if (!response.trim()) {
      alert("⚠ Please enter a response");
      return;
    }

    respondToTicket(ticketId, response);
    alert("✅ Response sent successfully!");
    setResponse("");
  };

  const handleStatusChange = (ticketId, newStatus) => {
    updateTicketStatus(ticketId, newStatus);
    alert(`✅ Ticket status updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "#f59e0b";
      case "In Progress": return "#3b82f6";
      case "Resolved": return "#10b981";
      case "Closed": return "#6b7280";
      default: return "#94a3b8";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#94a3b8";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🎫 Support Ticket Management</h2>
        <p className="subtitle">Manage student support requests and provide assistance</p>
      </div>

      {/* Stats */}
      <div className="stats-box">
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">📋</div>
          <h4>Total Tickets</h4>
          <p>{supportTickets.length}</p>
        </div>
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">🔓</div>
          <h4>Open Tickets</h4>
          <p>{supportTickets.filter(t => t.status === "Open").length}</p>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-icon">⏳</div>
          <h4>In Progress</h4>
          <p>{supportTickets.filter(t => t.status === "In Progress").length}</p>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <h4>Resolved</h4>
          <p>{supportTickets.filter(t => t.status === "Resolved").length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Tickets</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="support-tickets-container">
        {filteredTickets.length === 0 ? (
          <div className="card">
            <p className="no-tickets">No tickets found</p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div key={ticket.id} className="card support-ticket-card">
              <div className="ticket-header-admin">
                <div className="ticket-main-info">
                  <h3>#{ticket.id} - {ticket.subject}</h3>
                  <div className="ticket-student-info">
                    <span>👤 {ticket.studentUsername}</span>
                    <span>📧 {ticket.studentEmail}</span>
                  </div>
                </div>
                <div className="ticket-badges">
                  <span 
                    className="badge-status"
                    style={{ background: getStatusColor(ticket.status) }}
                  >
                    {ticket.status}
                  </span>
                  <span 
                    className="badge-priority"
                    style={{ borderColor: getPriorityColor(ticket.priority), color: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority}
                  </span>
                  <span className="badge-category">{ticket.category}</span>
                </div>
              </div>

              <div className="ticket-details">
                <p className="ticket-timestamp">
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </p>
                <div className="ticket-description-admin">
                  <strong>Issue Description:</strong>
                  <p>{ticket.description}</p>
                </div>

                {/* Responses */}
                {ticket.responses && ticket.responses.length > 0 && (
                  <div className="responses-section">
                    <h4>💬 Conversation:</h4>
                    {ticket.responses.map((resp, idx) => (
                      <div key={idx} className={`response-bubble ${resp.role}`}>
                        <div className="response-bubble-header">
                          <strong>{resp.by}</strong>
                          <span className="role-badge">{resp.role}</span>
                          <span className="response-time">
                            {new Date(resp.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p>{resp.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Response Form */}
                {ticket.status !== "Closed" && (
                  <div className="response-form">
                    <textarea
                      placeholder="Type your response to help the student..."
                      value={selectedTicket === ticket.id ? response : ""}
                      onChange={(e) => {
                        setSelectedTicket(ticket.id);
                        setResponse(e.target.value);
                      }}
                      className="response-textarea"
                      rows="4"
                    />
                    <div className="response-actions">
                      <button 
                        className="primary-btn"
                        onClick={() => handleRespond(ticket.id)}
                      >
                        📤 Send Response
                      </button>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                )}

                {ticket.status === "Closed" && (
                  <div className="ticket-closed-banner">
                    ✅ This ticket has been closed
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SupportManagement;
