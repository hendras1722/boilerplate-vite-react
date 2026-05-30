import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { DialogModal } from '../../components/ui/DialogModal'
import { InputField } from '../../components/ui/InputField'
import { SelectField } from '../../components/ui/SelectField'
import { Button } from '../../components/ui/Button'
import { Table, TableColumn } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Pagination } from '../../components/ui/Pagination'
import { UserPlus, Sparkles } from 'lucide-react'
import './DashboardOverview.css'

const chartData = [
  { label: 'Mon', value: 65, amount: '$4.2k' },
  { label: 'Tue', value: 45, amount: '$2.9k' },
  { label: 'Wed', value: 85, amount: '$5.5k' },
  { label: 'Thu', value: 55, amount: '$3.6k' },
  { label: 'Fri', value: 92, amount: '$6.0k' },
  { label: 'Sat', value: 38, amount: '$2.5k' },
  { label: 'Sun', value: 72, amount: '$4.7k' },
]

const transactions = [
  { name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC', color: 'purple', amount: '+$1,234.00', status: 'completed', date: 'May 29, 2026' },
  { name: 'Marcus Obi', email: 'marcus@example.com', avatar: 'MO', color: 'cyan', amount: '+$856.50', status: 'completed', date: 'May 28, 2026' },
  { name: 'Aiko Tanaka', email: 'aiko@example.com', avatar: 'AT', color: 'green', amount: '+$2,100.00', status: 'pending', date: 'May 28, 2026' },
  { name: 'Elena Volkov', email: 'elena@example.com', avatar: 'EV', color: 'amber', amount: '+$430.25', status: 'failed', date: 'May 27, 2026' },
  { name: 'James Park', email: 'james@example.com', avatar: 'JP', color: 'pink', amount: '+$1,678.90', status: 'completed', date: 'May 27, 2026' },
]

const activities = [
  { dot: 'purple', text: '<strong>Sarah Chen</strong> completed a purchase of $1,234', time: '2 minutes ago' },
  { dot: 'cyan', text: 'New user <strong>Marcus Obi</strong> registered', time: '15 minutes ago' },
  { dot: 'green', text: 'Revenue target for May has been <strong>achieved</strong>', time: '1 hour ago' },
  { dot: 'amber', text: '<strong>System update</strong> scheduled for maintenance', time: '3 hours ago' },
  { dot: 'red', text: 'Payment from <strong>Elena Volkov</strong> failed processing', time: '5 hours ago' },
]

function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function DashboardOverview() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('Member')

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Successfully invited ${memberName} (${memberEmail}) as ${memberRole}!`)
    setIsDialogOpen(false)
    setMemberName('')
    setMemberEmail('')
    setMemberRole('Member')
  }

  return (
    <div>
      {/* Page Header */}
      <div className="overview-header">
        <h1>Welcome back, Alex 👋</h1>
        <p className="overview-subtitle">
          Here's what's happening today ·{' '}
          <span className="overview-date">{getCurrentDate()}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="stat-badge up">↑ 12.5%</span>
          </div>
          <span className="stat-value">$48,352</span>
          <span className="stat-label">Total Revenue</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="stat-badge up">↑ 8.2%</span>
          </div>
          <span className="stat-value">12,845</span>
          <span className="stat-label">Active Users</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="stat-badge up">↑ 3.1%</span>
          </div>
          <span className="stat-value">4.63%</span>
          <span className="stat-label">Conversion Rate</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="stat-badge down">↓ 2.4%</span>
          </div>
          <span className="stat-value">3,672</span>
          <span className="stat-label">Total Orders</span>
        </div>
      </div>

      {/* Chart + Activity Feed */}
      <div className="content-grid">
        {/* Revenue Chart */}
        <div className="glass-card">
          <div className="glass-card-title">
            <h3>Revenue Overview</h3>
            <span className="card-badge">This Week</span>
          </div>
          <div className="chart-container">
            {chartData.map((bar) => (
              <div className="chart-bar-wrapper" key={bar.label}>
                <span className="chart-tooltip">{bar.amount}</span>
                <div
                  className="chart-bar"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="chart-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card">
          <div className="glass-card-title">
            <h3>Recent Activity</h3>
            <span className="card-badge">Live</span>
          </div>
          <div className="activity-feed">
            {activities.map((item, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${item.dot}`} />
                <div className="activity-content">
                  <p
                    className="activity-text"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                  <span className="activity-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card table-wrapper mb-6">
        <div className="glass-card-title">
          <h3>Recent Transactions</h3>
          <span className="card-badge">5 New</span>
        </div>
        <Table data={paginatedTransactions}>
          <TableColumn
            name="Customer"
            customRender={(row: typeof transactions[number]) => (
              <div className="tx-customer">
                <div className={`tx-avatar ${row.color}`}>{row.avatar}</div>
                <div>
                  <div className="tx-name">{row.name}</div>
                  <div className="tx-email">{row.email}</div>
                </div>
              </div>
            )}
            align="left"
          />
          <TableColumn
            name="Amount"
            accessor="amount"
            align="left"
          />
          <TableColumn
            name="Status"
            align="center"
            customRender={(row: typeof transactions[number]) => {
              const badgeColor = row.status === 'completed' ? 'green' : row.status === 'pending' ? 'amber' : 'red'
              return (
                <Badge color={badgeColor}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              )
            }}
          />
          <TableColumn
            name="Date"
            accessor="date"
            align="left"
          />
        </Table>

        <Flex justify="end" mt="4">
          <Pagination
            current={currentPage}
            total={transactions.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showTotal={(total) => `Total ${total} items`}
            showSizeChanger={false}
            showQuickJumper={false}
            pageSizeOptions={[2, 5, 10, 20]}
            onPageSizeChange={(size) => {
              setCurrentPage(1)
              setPageSize(size)
            }}
          />
        </Flex>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="quick-action-title">Quick Actions</h3>
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="action-label">New Project</span>
            <span className="action-desc">Create a new project</span>
          </div>

          <div
            className="action-card"
            role="button"
            tabIndex={0}
            onClick={() => setIsDialogOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsDialogOpen(true)
              }
            }}
          >
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="action-label">Add Member</span>
            <span className="action-desc">Invite team members</span>
          </div>

          <DialogModal
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title={
              <>
                <UserPlus size={20} className="text-[var(--accent-9)]" />
                <span>Invite Team Member</span>
              </>
            }
            description="Fill in the details below to send an invitation to a new team member."
          >
            <form onSubmit={handleInvite}>
              <Flex direction="column" gap="3">
                <InputField
                  label="Name"
                  placeholder="e.g. Sarah Chen"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />

                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="e.g. sarah@example.com"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                />

                <SelectField
                  label="Role"
                  value={memberRole}
                  onValueChange={setMemberRole}
                  options={[
                    { label: 'Admin', value: 'Admin' },
                    { label: 'Member', value: 'Member' },
                    { label: 'Viewer', value: 'Viewer' },
                  ]}
                />
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Button type="button" variant="soft" color="gray" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Sparkles size={14} />
                  Send Invitation
                </Button>
              </Flex>
            </form>
          </DialogModal>

          <div className="action-card">
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="action-label">Reports</span>
            <span className="action-desc">Generate analytics</span>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="action-label">Settings</span>
            <span className="action-desc">Configure preferences</span>
          </div>
        </div>
      </div>
    </div>
  )
}
