"""Development seed script for SYNAPSE.

Run with:
    python -m scripts.seed_data

The script creates a reproducible set of synthetic data:
- Fixed roles (system_admin, bureau_officer, reviewing_officer, coordination_officer, management_viewer)
- One user per role with a simple password.
- One institution with an alias.
- Two cases tied to that institution (different bureaus) that will trigger the overlap engine.
- An overlap record (pending review).
- A coordination request linking the two cases (active).

All UUIDs and identifiers are deterministic so the script can be re‑run without duplication errors.
"""

import sys, asyncio
sys.path.append('backend')

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import async_session_factory
from app.models.user import Role, RoleName, User
from app.models.institution import Institution, InstitutionAlias, VerificationStatus
from app.models.case import Case, CasePriority, CaseStatus
from app.models.overlap import Overlap, ReviewStatus
from app.models.coordination import CoordinationRequest, CoordinationStatus
from app.security.auth import hash_password

async def create_roles(session: AsyncSession):
    for role_name in RoleName:
        result = await session.execute(select(Role).where(Role.name == role_name))
        if not result.scalar_one_or_none():
            session.add(Role(name=role_name))
    await session.commit()

async def get_role(session: AsyncSession, role_name: RoleName) -> Role:
    result = await session.execute(select(Role).where(Role.name == role_name))
    return result.scalar_one()

async def seed():
    async with async_session_factory() as session:
        # 1. Roles
        await create_roles(session)

        # 2. Users (one per role)
        users_data = [
            {"email": "admin@example.com", "password": "admin123", "full_name": "Admin User", "role": RoleName.system_admin},
            {"email": "officer1@example.com", "password": "officer123", "full_name": "Officer One", "role": RoleName.bureau_officer},
            {"email": "reviewer@example.com", "password": "review123", "full_name": "Reviewer", "role": RoleName.reviewing_officer},
            {"email": "coord@example.com", "password": "coord123", "full_name": "Coordinator", "role": RoleName.coordination_officer},
            {"email": "viewer@example.com", "password": "viewer123", "full_name": "Viewer", "role": RoleName.management_viewer},
        ]
        for u in users_data:
            # avoid duplicates on re‑run
            exists = await session.execute(select(User).where(User.email == u["email"]))
            if exists.scalar_one_or_none():
                continue
            role = await get_role(session, u["role"])  # type: ignore[arg-type]
            user = User(
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                full_name=u["full_name"],
                role_id=role.id,
            )
            session.add(user)
        await session.commit()

        # 3. Institution with alias
        inst_id = uuid.UUID("11111111-1111-1111-1111-111111111111")
        institution = Institution(
            id=inst_id,
            name="Synthetic Institute of Technology",
            type="College",
            address="123 Main St, Cityville",
            state="StateX",
            district="DistrictY",
            verification_status=VerificationStatus.verified,
        )
        alias = InstitutionAlias(alias="SIT", source="seed", institution=institution)
        session.add_all([institution, alias])
        await session.commit()

        # 4. Cases
        owner_res = await session.execute(select(User).where(User.email == "officer1@example.com"))
        owner = owner_res.scalar_one()
        case_a = Case(
            case_number="CASE-001",
            institution_id=inst_id,
            bureau="Admissions",
            category="Eligibility",
            subject="Eligibility criteria unclear",
            description="The eligibility description on the website is ambiguous.",
            priority=CasePriority.high,
            status=CaseStatus.open,
            owner_id=owner.id,
            due_date=date.today() + timedelta(days=14),
        )
        case_b = Case(
            case_number="CASE-002",
            institution_id=inst_id,
            bureau="Examinations",
            category="Eligibility",
            subject="Duplicate eligibility issue",
            description="Similar eligibility confusion reported by a different student.",
            priority=CasePriority.medium,
            status=CaseStatus.new,
            owner_id=owner.id,
            due_date=date.today() + timedelta(days=10),
        )
        session.add_all([case_a, case_b])
        await session.commit()

        # 5. Overlap (pending review)
        overlap = Overlap(
            case_a_id=case_a.id,
            case_b_id=case_b.id,
            institution_score={"match": True, "confidence": 0.95},
            complaint_score={"keyword_overlap": 0.8},
            action_conflict_score={"conflict": False},
            overall_score={"value": 0.85, "threshold": 0.7},
            evidence=["Same institution ID", "Same category"],
            review_status=ReviewStatus.pending,
        )
        session.add(overlap)
        await session.commit()

        # 6. Coordination request (active)
        coord = CoordinationRequest(
            case_ids=[str(case_a.id), str(case_b.id)],
            requesting_bureau="Admissions",
            receiving_bureau="Examinations",
            purpose="Discuss overlapping eligibility concerns",
            evidence=[f"Overlap ID: {overlap.id}"],
            coordinator_id=owner.id,
            deadline=date.today() + timedelta(days=7),
            status=CoordinationStatus.submitted,
        )
        session.add(coord)
        await session.commit()

        print("✅ Seed data inserted successfully.")

if __name__ == "__main__":
    asyncio.run(seed())
