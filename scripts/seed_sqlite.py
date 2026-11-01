import json, sqlite3, sys
from pathlib import Path
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, DateTime, JSON, Date, Boolean, ForeignKey
from sqlalchemy.sql import func

DATA_PATH = Path(__file__).parent.parent / 'data' / 'mock_data.json'
engine = create_engine('sqlite:///db.sqlite3')
metadata = MetaData()

# Define tables mirroring the SYNAPSE models (simplified)
users = Table('users', metadata,
    Column('id', String, primary_key=True),
    Column('email', String),
    Column('full_name', String),
    Column('is_active', Boolean),
    Column('role', String)
)
institutions = Table('institutions', metadata,
    Column('id', String, primary_key=True),
    Column('official_id', String),
    Column('name', String),
    Column('type', String),
    Column('address', String),
    Column('state', String),
    Column('district', String),
    Column('website', String),
    Column('verification_status', String)
)
institution_aliases = Table('institution_aliases', metadata,
    Column('id', String, primary_key=True),
    Column('institution_id', String, ForeignKey('institutions.id')),
    Column('alias', String),
    Column('source', String)
)
cases = Table('cases', metadata,
    Column('id', String, primary_key=True),
    Column('case_number', String),
    Column('institution_id', String, ForeignKey('institutions.id')),
    Column('bureau', String),
    Column('category', String),
    Column('subject', String),
    Column('description', String),
    Column('priority', String),
    Column('status', String),
    Column('owner_id', String),
    Column('created_at', DateTime),
    Column('updated_at', DateTime),
    Column('due_date', Date),
    Column('resolution_date', Date),
    Column('attachments', JSON)
)
overlaps = Table('overlaps', metadata,
    Column('id', String, primary_key=True),
    Column('case_a_id', String, ForeignKey('cases.id')),
    Column('case_b_id', String, ForeignKey('cases.id')),
    Column('institution_score', JSON),
    Column('complaint_score', JSON),
    Column('action_conflict_score', JSON),
    Column('overall_score', JSON),
    Column('evidence', JSON),
    Column('review_status', String),
    Column('reviewer_id', String),
    Column('review_timestamp', DateTime),
    Column('review_notes', String),
    Column('detection_timestamp', DateTime)
)
coord_requests = Table('coordination_requests', metadata,
    Column('id', String, primary_key=True),
    Column('case_ids', JSON),
    Column('requesting_bureau', String),
    Column('receiving_bureau', String),
    Column('purpose', String),
    Column('evidence', JSON),
    Column('coordinator_id', String),
    Column('deadline', DateTime),
    Column('status', String),
    Column('created_at', DateTime),
    Column('decision', String),
    Column('decision_notes', String),
    Column('followup_owner_id', String),
    Column('followup_deadline', DateTime),
    Column('completed_at', DateTime)
)
audit_events = Table('audit_events', metadata,
    Column('id', String, primary_key=True),
    Column('actor', String),
    Column('action', String),
    Column('entity_type', String),
    Column('entity_id', String),
    Column('timestamp', DateTime),
    Column('summary', String),
    Column('changed_fields', JSON),
    Column('request_id', String)
)

metadata.create_all(engine)

with open(DATA_PATH) as f:
    data = json.load(f)

def parse_dt(s):
    return s

with engine.begin() as conn:
    # users
    for u in data['users']:
        conn.execute(users.insert().values(
            id=u['id'],
            email=u['email'],
            full_name=u['full_name'],
            is_active=u['is_active'],
            role=u['role']
        ))
    # institutions
    for inst in data['institutions']:
        conn.execute(institutions.insert().values(
            id=inst['id'],
            official_id=inst.get('official_id'),
            name=inst['name'],
            type=inst['type'],
            address=inst.get('address'),
            state=inst.get('state'),
            district=inst.get('district'),
            website=inst.get('website'),
            verification_status=inst['verification_status']
        ))
    # aliases
    for a in data['institution_aliases']:
        conn.execute(institution_aliases.insert().values(
            id=a['id'],
            institution_id=a['institution_id'],
            alias=a['alias'],
            source=a.get('source','seed')
        ))
    # cases
    for c in data['cases']:
        conn.execute(cases.insert().values(
            id=c['id'],
            case_number=c['case_number'],
            institution_id=c['institution_id'],
            bureau=c['bureau'],
            category=c['category'],
            subject=c['subject'],
            description=c['description'],
            priority=c['priority'],
            status=c['status'],
            owner_id=c['owner_id'],
            created_at=c['created_at'],
            updated_at=c['updated_at'],
            due_date=c.get('due_date'),
            resolution_date=c.get('resolution_date'),
            attachments=c.get('attachments', {})
        ))
    # overlaps
    for o in data['overlaps']:
        conn.execute(overlaps.insert().values(
            id=o['id'],
            case_a_id=o['case_a_id'],
            case_b_id=o['case_b_id'],
            institution_score=o['institution_score'],
            complaint_score=o['complaint_score'],
            action_conflict_score=o['action_conflict_score'],
            overall_score=o['overall_score'],
            evidence=o['evidence'],
            review_status=o['review_status'],
            reviewer_id=o.get('reviewer_id'),
            review_timestamp=o.get('review_timestamp'),
            review_notes=o.get('review_notes'),
            detection_timestamp=o['detected_at']
        ))
    # coordination requests
    for cr in data['coordination_requests']:
        conn.execute(coord_requests.insert().values(
            id=cr['id'],
            case_ids=cr['case_ids'],
            requesting_bureau=cr['requesting_bureau'],
            receiving_bureau=cr['receiving_bureau'],
            purpose=cr['purpose'],
            evidence=cr['evidence'],
            coordinator_id=cr['coordinator_id'],
            deadline=cr['deadline'],
            status=cr['status'],
            created_at=cr['created_at'],
            decision=cr.get('decision'),
            decision_notes=cr.get('decision_notes'),
            followup_owner_id=cr.get('followup_owner_id'),
            followup_deadline=cr.get('followup_deadline'),
            completed_at=cr.get('completed_at')
        ))
    # audit events
    for a in data['audit_events']:
        conn.execute(audit_events.insert().values(
            id=a['id'],
            actor=a['actor'],
            action=a['action'],
            entity_type=a['entity_type'],
            entity_id=a.get('entity_id'),
            timestamp=a['timestamp'],
            summary=a['summary'],
            changed_fields=a.get('changed_fields'),
            request_id=a.get('request_id')
        ))

print('SQLite DB seeded successfully.')